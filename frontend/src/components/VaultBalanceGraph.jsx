import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";

function VaultBalanceGraph() {
  const duration = 750;
  const easingMode = "easeInExpo";
  const chartDataYear = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      // "Jul",
      // "Aug",
      // "Sep",
      // "Oct",
      // "Nov",
      // "Dec",
    ],
    datasets: [
      {
        label: "Balance",
        data: [0, 5250, 8500, 12500, 17000, 22000],
        borderColor: "oklch(0.6739 0.0437 200.02)",
        backgroundColor: "oklch(0.6739 0.0437 200.02 / 0.35)",
        fill: true,
        tension: 0.25,
        animation: {
          delay: 0,
          duration: duration,
          easing: easingMode,
        },
      },
    ],
  };
  const chartDataMonth = {
    labels: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
    ],
    datasets: [
      {
        label: "Balance",
        data: [
          19242, 22274, 28407, 29609, 35125, 31415, 25142, 22735, 34502, 30245,
          26418, 29473, 32750, 28146, 33290, 27465, 24612, 21980, 35210, 28734,
          31250, 26890, 34125, 29375, 32640, 28190, 30450, 25780, 27930, 32470,
        ],
        borderColor: "oklch(0.6739 0.0437 200.02)",
        backgroundColor: "oklch(0.6739 0.0437 200.02 / 0.35)",
        fill: true,
        tension: 0.25,
        animation: {
          delay: 0,
          duration: duration,
          easing: easingMode,
        },
      },
    ],
  };

  return (
    <Line
      data={chartDataYear}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: 1.25,
        plugins: {
          tooltip: {
            callbacks: {
              title: () => "",
              label: function (context) {
                let label = context.dataset.label || "";

                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EUR",
                  }).format(context.parsed.y);
                }
                return label;
              },
            },
            displayColors: false,
            bodyColor: "oklch(0.3766 0.0159 255.61)",
            backgroundColor: "oklch(from #ecf4e9 l c h)",
          },
          legend: {
            display: false,
            labels: {
              color: "oklch(0.9085 0.0361 53.7)",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "oklch(from #2d4631 l c h)",
            },
            grid: {
              color: "transparent",
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "oklch(from #2d4631 l c h)",
              stepSize: 5000,
            },
            grid: {
              color: "oklch(from #2d4631 l c h / 0.15)",
            },
          },
        },
      }}
    />
  );
}

export default VaultBalanceGraph;
