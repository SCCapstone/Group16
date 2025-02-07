export interface Course {
  id: string;
  name: string;
}

export interface Assignment {
  id?: string | null,
  userId: string,
  courseId: string,
  title: string,
  description?: string,
  availability: {
    adaptiveRelease: {
      end: Date
    }
  },
  complete?: boolean,
  userCreated: boolean
}

export interface Grade {
  id?: string,
  courseId: string,
  assignmentId: string,
  userId: string,
  percent: number,
  gradeChar?: string
}
