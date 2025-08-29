import { CreateTutorialDialog } from "@/features/tutorial/create-tutorial-dialog";
import TutorialPage from "@/features/tutorial/tutorial-page";

const page = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="title">Upload Tutorial</h1>
                <CreateTutorialDialog />
            </div>
            <TutorialPage isPermission={true} />
        </div>
    );
};

export default page;
