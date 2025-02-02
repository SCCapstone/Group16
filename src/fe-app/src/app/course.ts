export interface Course {
  id: string;
  name: string;
}

export interface Assignment {
  id?: string,
  userId: string,
  courseId: string,
  title: string,
  description?: string,
  availability: {
    adaptiveRelease: {
      end: Date
    }
  },
  completed?: boolean
}

export interface Grade {
  id?: string,
  courseId: string,
  assignmentId: string,
  userId: string,
  percent: number,
  gradeChar?: string
}
