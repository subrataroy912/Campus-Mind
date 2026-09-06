import { ContentList } from "@/components/common/ContentList";
import ClassCard from "@/features/classroom/components/ClassCard";

const RenderTabContent = ({ activeTab, classrooms= [] }) => {
  switch (activeTab) {
    case 0:
      return (
        <ContentList
          layout="grid"
          items={classrooms}
          renderItem={(classroom) => <ClassCard classroom={classroom} />}
        />
      );

    case 1:
      return <div className="text-gray-600">You have no new messages.</div>;
    default:
      return null;
  }
};

export default RenderTabContent;
