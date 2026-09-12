export function reportWebVitals(onPerfEntry) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onINP(onPerfEntry);
      onLCP(onPerfEntry);
      onFCP(onPerfEntry);
      onTTFB(onPerfEntry);
    }).catch(() => {});
  } else {
    import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      const logMetric = (metric) => {
        console.log(
          `[Web Vitals] ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`
        );
      };
      onCLS(logMetric);
      onINP(logMetric);
      onLCP(logMetric);
      onFCP(logMetric);
      onTTFB(logMetric);
    }).catch(() => {});
  }
}
