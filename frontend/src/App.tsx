import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CreateTimetable from './pages/CreateTimetable';
import SetConstraints from './pages/SetConstraints';
import Optimize from './pages/Optimize';
import TimetableResult from './pages/TimetableResult';
import VerifySchedule from './pages/VerifySchedule';
import ProjectIntelligence from './pages/ProjectIntelligence';
import Publish from './pages/Publish';
import GridBackgroundLayout from './components/GridBackgroundLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route element={<GridBackgroundLayout />}>
          <Route path="/create" element={<CreateTimetable />} />
          <Route path="/constraints" element={<SetConstraints />} />
          <Route path="/optimize" element={<Optimize />} />
          <Route path="/result" element={<TimetableResult />} />
          <Route path="/verify" element={<VerifySchedule />} />
          <Route path="/insights" element={<ProjectIntelligence />} />
          <Route path="/publish" element={<Publish />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
