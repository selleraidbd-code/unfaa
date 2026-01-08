import CoursePage from "@/features/course/course-page";
import { CreateCourseDialog } from "@/features/course/create-course-dialog";

const page = () => {
    return (
        <div className="space-y-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="title">Manage Courses</h1>
                <CreateCourseDialog />
            </div>
            <CoursePage isPermission={true} />
        </div>
    );
};

export default page;
