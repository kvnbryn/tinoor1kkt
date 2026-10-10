/* ==========================================================================
   CHART.JS DEMOGRAPHY CHARTS MODULE (Kelurahan Tinoor Satu Data Resmi)
   ========================================================================== */

import {
  Chart,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export function initCharts() {
  const chartFont = {
    family: 'Outfit, sans-serif',
    size: 13,
  };

  const tooltipConfig = {
    backgroundColor: '#1b4d08',
    titleFont: { family: 'Outfit', size: 13, weight: '700' },
    bodyFont: { family: 'Outfit', size: 12 },
    padding: 10,
    cornerRadius: 8,
    displayColors: true,
  };

  // 1. Chart Komposisi Keagamaan (Kristen Protestan: 1.560, Katolik: 86, Islam: 5)
  const ctxAgama = document.getElementById('chart-agama');
  if (ctxAgama) {
    new Chart(ctxAgama, {
      type: 'doughnut',
      data: {
        labels: ['Kristen Protestan', 'Katolik', 'Islam'],
        datasets: [
          {
            data: [1560, 86, 5],
            backgroundColor: ['#3d920c', '#6bd731', '#f59e0b'],
            borderColor: '#FFFFFF',
            borderWidth: 3,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: chartFont,
              usePointStyle: true,
              boxWidth: 10,
              padding: 20,
            },
          },
          tooltip: {
            ...tooltipConfig,
            callbacks: {
              label: function (context) {
                const total = 1560 + 86 + 5;
                const value = context.parsed;
                const percentage = ((value / total) * 100).toFixed(1);
                return ` ${context.label}: ${value.toLocaleString('id-ID')} Jiwa (${percentage}%)`;
              },
            },
          },
        },
        cutout: '62%',
      },
    });
  }

  // 2. Chart Komposisi Jenis Kelamin (Laki-laki: 896, Perempuan: 835)
  const ctxGender = document.getElementById('chart-gender');
  if (ctxGender) {
    new Chart(ctxGender, {
      type: 'bar',
      data: {
        labels: ['Laki-Laki', 'Perempuan'],
        datasets: [
          {
            label: 'Jumlah Jiwa',
            data: [896, 835],
            backgroundColor: ['#4da91b', '#87de57'],
            borderRadius: 8,
            maxBarThickness: 70,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipConfig,
            callbacks: {
              label: function (context) {
                const total = 896 + 835;
                const value = context.parsed.y;
                const percentage = ((value / total) * 100).toFixed(1);
                return ` ${value} Jiwa (${percentage}%)`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: chartFont },
          },
          y: {
            beginAtZero: true,
            max: 1000,
            ticks: { font: chartFont },
            grid: { color: 'rgba(0,0,0,0.05)' },
          },
        },
      },
    });
  }
}
