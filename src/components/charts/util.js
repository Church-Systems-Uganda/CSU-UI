import { ThemeColors } from 'helpers/ThemeColors';

export const chartTooltip = {
  backgroundColor: ThemeColors().foregroundColor,
  titleFontColor: ThemeColors().primaryColor,
  borderColor: ThemeColors().separatorColor,
  borderWidth: 0.5,
  bodyFontColor: ThemeColors().primaryColor,
  bodySpacing: 10,
  xPadding: 15,
  yPadding: 15,
  cornerRadius: 0.15,
};

export const centerTextPlugin = {
  afterDatasetsUpdate() {},
  beforeDraw(chart) {
    const width = chart.chartArea.right;
    const height = chart.chartArea.bottom;
    const { ctx } = chart.chart;
    ctx.restore();

    let activeLabel = chart.data.labels[0];
    let activeValue = chart.data.datasets[0].data[0];
    let dataset = chart.data.datasets[0];
    // eslint-disable-next-line no-underscore-dangle
    let meta = dataset._meta[Object.keys(dataset._meta)[0]];
    let { total } = meta;

    let activePercentage = parseFloat(((activeValue / total) * 100).toFixed(1));
    activePercentage = chart.legend.legendItems[0].hidden
      ? 0
      : activePercentage;

    if (chart.pointAvailable) {
      activeLabel = chart.data.labels[chart.pointIndex];
      activeValue =
        chart.data.datasets[chart.pointDataIndex].data[chart.pointIndex];

      dataset = chart.data.datasets[chart.pointDataIndex];
      // eslint-disable-next-line no-underscore-dangle
      meta = dataset._meta[Object.keys(dataset._meta)[0]];
      total = meta.total;
      activePercentage = parseFloat(((activeValue / total) * 100).toFixed(1));
      activePercentage = chart.legend.legendItems[chart.pointIndex].hidden
        ? 0
        : activePercentage;
    }

    ctx.font = '36px Nunito, sans-serif';
    ctx.fillStyle = ThemeColors().primaryColor;
    ctx.textBaseline = 'middle';

    const text = `${activePercentage}%`;
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;
    ctx.fillText(text, textX, textY);

    ctx.font = '14px Nunito, sans-serif';
    ctx.textBaseline = 'middle';

    const text2 = activeLabel;
    const textX2 = Math.round((width - ctx.measureText(text2).width) / 2);
    const textY2 = height / 2 - 30;
    ctx.fillText(text2, textX2, textY2);

    ctx.save();
  },
  // eslint-disable-next-line no-unused-vars
  beforeEvent(chart, event, options) {
    const firstPoint = chart.getElementAtEvent(event)[0];

    if (firstPoint) {
      // eslint-disable-next-line no-underscore-dangle,no-param-reassign
      chart.pointIndex = firstPoint._index;
      // eslint-disable-next-line no-underscore-dangle,no-param-reassign
      chart.pointDataIndex = firstPoint._datasetIndex;
      // eslint-disable-next-line no-param-reassign
      chart.pointAvailable = true;
    }
  },
};
