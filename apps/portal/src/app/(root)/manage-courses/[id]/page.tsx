import { CourseDetailPage } from "@/features/course/course-detail-page";

const ManageCourseDetailRoute = () => {
    return (
        <div className="space-y-4">
            <CourseDetailPage isPermission={true} />
        </div>
    );
};

export default ManageCourseDetailRoute;
