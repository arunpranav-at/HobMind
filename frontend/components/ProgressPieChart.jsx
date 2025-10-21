import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

export default function ProgressPieChart({ techniques }) {
  const statusCounts = {
    mastered: 0,
    'in-progress': 0,
    'not-started': 0,
  };
  techniques.forEach(t => {
    if (statusCounts[t.status]) {
      statusCounts[t.status]++;
    } else {
      statusCounts['not-started']++;
    }
  });
  const data = {
    labels: ['Mastered', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [statusCounts.mastered, statusCounts['in-progress'], statusCounts['not-started']],
        backgroundColor: ['#22c55e', '#f59e0b', '#64748b'],
        borderWidth: 2,
      },
    ],
  };
  return (
    <div className="w-40 mx-auto mb-4">
      <Pie data={data} options={{ plugins: { legend: { display: true, position: 'bottom' } } }} />
    </div>
  );
}
