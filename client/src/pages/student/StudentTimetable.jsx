import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentTimetable } from '../../redux/slices/timetableSlice';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';

const StudentTimetable = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { entries, loading, error } = useSelector((state) => state.timetable);
  const [selectedDay, setSelectedDay] = useState('Monday');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchStudentTimetable(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Group entries by day
  const entriesByDay = entries.reduce((acc, entry) => {
    if (!acc[entry.dayOfWeek]) {
      acc[entry.dayOfWeek] = [];
    }
    acc[entry.dayOfWeek].push(entry);
    return acc;
  }, {});

  // Sort entries by start time for selected day
  const sortedEntries = (entriesByDay[selectedDay] || []).sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  // Get color based on type
  const getTypeColor = (type) => {
    const colors = {
      Lecture: 'bg-blue-100 text-blue-800 border-blue-300',
      Tutorial: 'bg-green-100 text-green-800 border-green-300',
      Lab: 'bg-purple-100 text-purple-800 border-purple-300',
      Practical: 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-8 h-8 text-blue-600" />
          My Timetable
        </h1>
        <p className="text-gray-600 mt-2">View your weekly class schedule</p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Timetable Available</h3>
          <p className="text-gray-600">
            Your timetable hasn't been created yet. Please contact your administrator.
          </p>
        </div>
      ) : (
        <>
          {/* Day selector */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => {
                const hasClasses = entriesByDay[day]?.length > 0;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedDay === day
                        ? 'bg-blue-600 text-white shadow-md'
                        : hasClasses
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!hasClasses}
                  >
                    {day}
                    {hasClasses && (
                      <span className="ml-2 text-xs bg-white bg-opacity-30 px-2 py-0.5 rounded-full">
                        {entriesByDay[day].length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timetable entries for selected day */}
          <div className="space-y-4">
            {sortedEntries.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No classes scheduled for {selectedDay}</p>
              </div>
            ) : (
              sortedEntries.map((entry) => (
                <div
                  key={entry._id}
                  className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getTypeColor(
                    entry.type
                  )} hover:shadow-lg transition-shadow duration-200`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {entry.subject}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            entry.type
                          )}`}
                        >
                          {entry.type}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {entry.startTime} - {entry.endTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{entry.faculty?.name || 'N/A'}</span>
                        </div>

                        {entry.room && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{entry.room}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-gray-600">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm">
                            {entry.class?.code || 'N/A'} - {entry.class?.name || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="md:text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {entry.startTime}
                      </div>
                      <div className="text-sm text-gray-500">
                        {entry.endTime}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Weekly overview */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className={`p-4 rounded-lg text-center ${
                    entriesByDay[day]?.length > 0
                      ? 'bg-blue-50 border-2 border-blue-200'
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <div className="font-semibold text-gray-800">{day}</div>
                  <div className="text-2xl font-bold text-blue-600 mt-2">
                    {entriesByDay[day]?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {entriesByDay[day]?.length === 1 ? 'class' : 'classes'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentTimetable;
