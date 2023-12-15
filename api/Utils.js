export const formatNumber = (num) => num.toString().length < 2 ? `0${num}` : num

export const getDay = () =>{
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let date = new Date();
  let dayIndex = date.getDay();
  dayIndex = (dayIndex + 6) % 7;
  let dayName = days[dayIndex];
  
  return ([{ id: dayIndex, name: dayName }]);
}

export const getNextTime =(dayOfWeek, hour, minute) =>{
  const today = new Date();
  const nextDay = new Date();
  //console.log({dayOfWeek})
  // Calculate the index of the desired day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = daysOfWeek.indexOf(dayOfWeek);
  //console.log({dayIndex})

  // Calculate the number of days to add to get to the next occurrence of the specified day
  let daysToAdd = (dayIndex + 7 - today.getDay()) % 7;
  if (daysToAdd === 0 && (today.getHours() > hour || (today.getHours() === hour && today.getMinutes() >= minute))) {
      // If it's currently the same day of the week but the time has already passed, set for next week
      daysToAdd = 7;
  }
  //console.log({daysToAdd})

  nextDay.setDate(today.getDate() + daysToAdd);
  nextDay.setHours(hour, minute, 0, 0); // Set to the specified hour and minute
  
  return nextDay;
}