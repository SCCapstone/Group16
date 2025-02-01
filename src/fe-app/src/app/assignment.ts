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
  }
  completed?:boolean;
}
