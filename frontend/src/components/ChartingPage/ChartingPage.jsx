import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cpg from './ChartingPage.module.css';

const ChartingPage = () => {
  const user = useSelector((state) => state.session.user);
  const allCharts = useSelector((state) => state.chart.AllChart);
  const [loading, setLoading] = useState(true);
  const [meetingDate, setMeetingDate] = useState('');
  const [diagnosesICD10, setDiagnosesICD10] = useState('')

  return (
    <div className={cpg.mainContainer}>
      <h1 className={cpg.mainTitle}>The Charting Page</h1>
    </div>
  )
}

export default ChartingPage;