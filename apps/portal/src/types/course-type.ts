export interface Course {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    videoUrl?: string;
    price?: number;
    isFree?: boolean;
    createdAt: string;
    updatedAt: string;
    videos: CourseVideo[];
}

export interface CreateCourse {
    title: string;
    description?: string;
    thumbnail?: string;
    videoUrl?: string;
    price?: number;
    isFree?: boolean;
}

export interface UpdateCourse extends Partial<CreateCourse> {}

export interface CourseVideo {
    id: string;
    courseId: string;
    title: string;
    videoUrl: string;
    duration?: number;
    isFree?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCourseVideo {
    courseId: string;
    title: string;
    videoUrl: string;
    duration?: number;
    isFree?: boolean;
}

export interface UpdateCourseVideo extends Partial<Omit<CreateCourseVideo, "courseId">> {}
