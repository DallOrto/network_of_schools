import { Class } from "@prisma/client";


function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function timesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);

  return start1Min < end2Min && end1Min > start2Min;
}

function hasScheduleConflict(class1: Class, class2: Class): boolean {
  if (class1.classDay !== class2.classDay) {
    return false;
  }

  return timesOverlap(
    class1.startTime,
    class1.endTime,
    class2.startTime,
    class2.endTime
  );
}

export { hasScheduleConflict, timesOverlap, timeToMinutes };