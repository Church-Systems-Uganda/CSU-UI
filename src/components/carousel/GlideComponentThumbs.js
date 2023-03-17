import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Glide from '@glidejs/glide';
import { getDirection } from 'helpers/Utils';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';

let resizeTimeOut = -1;
let mountTimeOut = -1;

const defaultProps = {
  settingsImages: {},
  settingsThumbs: {},
};

let carouselImages;
let carouselThumbs;

function GlideComponentThumbs(props = defaultProps) {
  const glideCarouselImages = useRef(null);
  const glideCarouselThumbs = useRef(null);
  // eslint-disable-next-line react/destructuring-assignment
  const total = props.settingsImages.data.length;

  const [activeIndex, setactiveIndex] = useState(0);
  const [thumbsPerView, setThumbsPerView] = useState(
    // eslint-disable-next-line react/destructuring-assignment
    Math.min(props.settingsThumbs.perView, props.settingsImages.data.length)
  );
  const [renderArrows, setRenderArrows] = useState(true);

  const updateThumbBreakpoints = () => {
    const thumbBreakpoints = props.settingsThumbs.breakpoints;
    const newBreakpoints = {};
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const prop in thumbBreakpoints) {
      newBreakpoints[prop] = {
        perView: Math.min(thumbBreakpoints[prop].perView, total),
      };
    }
    // eslint-disable-next-line no-param-reassign
    props.settingsThumbs.breakpoints = newBreakpoints;
  };

  const thumbsResize = () => {
    const perView = Math.min(
      props.settingsThumbs.perView,
      props.settingsImages.data.length
    );
    setThumbsPerView(perView);
    if (total <= perView) {
      setRenderArrows(false);
    }
  };

  const imagesSwipeEnd = () => {
    const gap = carouselThumbs.index + thumbsPerView;
    setactiveIndex(carouselImages.index);
    if (activeIndex >= gap) {
      carouselThumbs.go('>');
    }
    if (activeIndex < carouselThumbs.index) {
      carouselThumbs.go('<');
    }
  };

  const onResize = () => {
    clearTimeout(resizeTimeOut);
    resizeTimeOut = setTimeout(() => {
      carouselImages.update();
      carouselThumbs.update();
      clearTimeout(resizeTimeOut);
    }, 500);
  };

  const onThumbClick = (index) => {
    setactiveIndex(index);
    carouselImages.go(`=${index}`);
  };

  useEffect(() => {
    /* glideCarouselImages init */
    carouselImages = new Glide(glideCarouselImages.current, {
      ...props.settingsImages,
      direction: getDirection().direction,
    });
    carouselImages.mount();
    // eslint-disable-next-line no-use-before-define
    carouselImages.on('swipe.end', imagesSwipeEnd);

    /* glideCarouselThumbs init */
    carouselThumbs = new Glide(glideCarouselThumbs.current, {
      ...props.settingsThumbs,
      direction: getDirection().direction,
    });
    carouselThumbs.mount();
    carouselThumbs.on('resize', thumbsResize);

    mountTimeOut = setTimeout(() => {
      const event = document.createEvent('HTMLEvents');
      event.initEvent('resize', false, false);
      window.dispatchEvent(event);
      carouselImages.on('resize', onResize);
    }, 500);

    updateThumbBreakpoints();

    return () => {
      clearTimeout(resizeTimeOut);
      clearTimeout(mountTimeOut);
      carouselImages.destroy();
      carouselThumbs.destroy();
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return (
    <div>
      <div className="glide details" ref={glideCarouselImages}>
        <div data-glide-el="track" className="glide__track">
          <div className="glide__slides">
            {/* eslint-disable-next-line react/destructuring-assignment */}
            {props.settingsImages.data.map((item) => {
              return (
                <div key={item.id}>
                  <div className="glide__slide">
                    <img
                      alt="detail"
                      src={item.img}
                      className="responsive border-0 border-radius img-fluid mb-3"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="glide thumbs" ref={glideCarouselThumbs}>
        <div data-glide-el="track" className="glide__track">
          <div className="glide__slides">
            {/* eslint-disable-next-line react/destructuring-assignment */}
            {props.settingsThumbs.data.map((item, index) => {
              return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                <div
                  className={
                    index === activeIndex
                      ? 'glide__slide active'
                      : 'glide__slide'
                  }
                  key={item.id}
                  onClick={() => {
                    onThumbClick(index);
                  }}
                >
                  <img
                    alt="detail"
                    src={item.img}
                    className="responsive border-0 border-radius img-fluid"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {renderArrows && (
          <div className="glide__arrows" data-glide-el="controls">
            <button
              type="button"
              className="glide__arrow glide__arrow--left"
              data-glide-dir="<"
            >
              <i className="simple-icon-arrow-left" />
            </button>
            <button
              type="button"
              className="glide__arrow glide__arrow--right"
              data-glide-dir=">"
            >
              <i className="simple-icon-arrow-right" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

GlideComponentThumbs.defaultProps = {
  settingsImages: {},
  settingsThumbs: {},
};

GlideComponentThumbs.propTypes = {
  settingsImages: PropTypes.shape({
    type: PropTypes.string,
    startAt: PropTypes.number,
    perView: PropTypes.number,
    focusAt: PropTypes.number,
    gap: PropTypes.number,
    autoplay: PropTypes.bool,
    hoverpause: PropTypes.bool,
    keyboard: PropTypes.bool,
    bound: PropTypes.bool,
    swipeThreshold: PropTypes.oneOf([PropTypes.number, PropTypes.bool]),
    dragThreshold: PropTypes.oneOf([PropTypes.number, PropTypes.bool]),
    perTouch: PropTypes.oneOf([PropTypes.number, PropTypes.bool]),
    touchRatio: PropTypes.number,
    touchAngle: PropTypes.number,
    animationDuration: PropTypes.number,
    rewind: PropTypes.bool,
    rewindDuration: PropTypes.number,
    animationTimingFunc: PropTypes.string,
    direction: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    peek: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    breakpoints: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object,
    throttle: PropTypes.number,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array,
  }),
  settingsThumbs: PropTypes.shape({
    type: PropTypes.string,
    startAt: PropTypes.number,
    perView: PropTypes.number,
    focusAt: PropTypes.number,
    gap: PropTypes.number,
    autoplay: PropTypes.bool,
    hoverpause: PropTypes.bool,
    keyboard: PropTypes.bool,
    bound: PropTypes.bool,
    swipeThreshold: PropTypes.oneOf([PropTypes.number, PropTypes.bool]),
    dragThreshold: PropTypes.oneOf([PropTypes.number, PropTypes.bool]),
    perTouch: PropTypes.oneOf([PropTypes.number, PropTypes.bool]),
    touchRatio: PropTypes.number,
    touchAngle: PropTypes.number,
    animationDuration: PropTypes.number,
    rewind: PropTypes.bool,
    rewindDuration: PropTypes.number,
    animationTimingFunc: PropTypes.string,
    direction: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    peek: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    breakpoints: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    classes: PropTypes.object,
    throttle: PropTypes.number,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array,
  }),
  // id: PropTypes.string,
  // className: PropTypes.string,
};

export default GlideComponentThumbs;
