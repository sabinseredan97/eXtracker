import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPeriosExp } from "../../api/axios";
import DatePicker from "react-datepicker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart() {
  const [data, setData] = useState();
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(endDate.getDate() - 30))
  );
  const todayDate = new Date();
  const yesterdayDate = new Date(new Date().setDate(todayDate.getDate() - 1));

  const {
    data: periodExpData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["period-exp-" + startDate + "-" + endDate],
    queryFn: () => getPeriosExp(startDate, endDate),
  });

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>{error.message}</p>;
  }

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        forceNiceScale: true,
        grace: "75%",
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Money spent in the ${startDate} - ${endDate} time period`,
      },
    },
  };

  useEffect(() => {
    if (periodExpData) {
      setData({
        labels: periodExpData.map((item) => item.date),
        datasets: [
          {
            fill: true,
            label: "money spent",
            data: periodExpData.map((item) => item.totalPrice),
            backgroundColor: "rgb(0,255,0)",
            borderColor: "rgb(0,255,0)",
          },
        ],
      });
    }
  }, [periodExpData]);

  return (
    <>
      <section>
        <span>From: </span>
        <DatePicker
          selectsStart
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          startDate={startDate}
          maxDate={yesterdayDate}
        />
        <span> to: </span>
        <DatePicker
          selectsEnd
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          endDate={endDate}
          startDate={startDate}
          minDate={startDate}
          maxDate={todayDate}
        />
      </section>
      {!content && data ? (
        <>
          <Line data={data} options={options} width={"500%"} />
          <p className="text-danger text-center">
            Only the dates when you spent money are shown on the graph
          </p>
        </>
      ) : (
        content
      )}
    </>
  );
}
