// Importing necessary modules and components
import {
  DndContext,
  rectIntersection,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import KanbanLane from "./KanbanLane";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { add } from "lodash";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../store/slices/user-slice";
import { FaPlus } from "react-icons/fa";
import EditWorkItemModel from "../EditWorkItemModel";
import CreateWorkItemModel from "../CreateWorkItemModel";
import { createNewWorkItem } from "../../store/slices/workitem-slice";
import WorkItem from "../../models/workitem";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { editWorkItem } from "../../store/slices/workitem-slice";
import { useTranslation } from "react-i18next";

interface Props {
  onClose: () => void;
  workitems: any;
  teamMembers: any;
  projectId: string;
  ownerId: string;
}

const KanbanBoard = (props: Props) => {
  const { onClose, workitems, teamMembers, projectId, ownerId } = props;
  const [backlogItems, setBacklogItems] = useState<any>([]);
  const [completedItems, setCompletedItems] = useState<any>([]);
  const [inProgressItems, setInProgressItems] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);

  useEffect(() => {
    setBacklogItems(workitems.filter((item: any) => item.status === "backlog"));
    setCompletedItems(workitems.filter((item: any) => item.status === "completed"));
    setInProgressItems(workitems.filter((item: any) => item.status === "inprogress"));
    setSelectedItems(workitems.filter((item: any) => item.status === "selected"));
  }, [workitems]);

  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );
  const { t } = useTranslation("common");

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    const container = over?.id;
    const activeItem = active.data.current;

    if (container && activeItem.parent !== container) {
      dispatch(editWorkItem({
        _id: activeItem.selectedWorkItem._id,
        status: container.replace(/\s/g, "").toLowerCase(),
      }));
    }
  };

  useEffect(() => {
    // Close the Kanban board if all work items are completed
    if (backlogItems.length === 0 && inProgressItems.length === 0 && selectedItems.length === 0 && completedItems.length > 0) {
      onClose(); // Call the onClose prop
    }
  }, [backlogItems, completedItems, inProgressItems, selectedItems, onClose]); // Dependencies include all item lists and onClose function

  return (
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
      <Flex flexDirection="column">
        <Flex flex="4">
          <KanbanLane projectId={projectId} title={t("board.kanban.backlog.label")} items={backlogItems} teamMembers={teamMembers} />
          <KanbanLane projectId={projectId} title={t("board.kanban.selected.label")} items={selectedItems} teamMembers={teamMembers} />
          <KanbanLane projectId={projectId} title={t("board.kanban.inprogress.label")} items={inProgressItems} teamMembers={teamMembers} />
          <KanbanLane projectId={projectId} title={t("board.kanban.completed.label")} items={completedItems} teamMembers={teamMembers} />
        </Flex>
      </Flex>
    </DndContext>
  );
};

export default KanbanBoard;
