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
  }
}

export interface Grade {

}
