import { useDispatch } from "react-redux";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { setArticle } from "../../../redux/actions";

import SortableAuthor from "./SortableAuthor";

const SortableAuthorList = (props) => {
  const dispatch = useDispatch();
  let { authors, onDeleteAuthor, onChangeAuthor, auth, language, removable } =
    props;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  let ids = [];
  let items = [];
  authors.forEach((author) => {
    if (
      !author ||
      author.status === "DELETED" ||
      ids.indexOf(author.id) !== -1
    ) {
      return null;
    }
    ids.push(author.id);
    items.push({
      ...author,
      isRemovable:
        author.id !== auth.user.id ||
        (author.id == auth.user.id && authors.length > 1),
    });
  });

  const handleDragEnd = (event) => {
    let newAuthors = [...authors];
    const { active, over } = event;
    console.log(event);

    if (active.id !== over.id) {
      const oldIndex = authors.findIndex((object) => object.id === active.id);
      const newIndex = authors.findIndex((object) => object.id === over.id);

      newAuthors = arrayMove(authors, oldIndex, newIndex);

      console.log(newAuthors);

      dispatch(setArticle({ index: "authors", value: newAuthors }));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => (
          <SortableAuthor
            key={item.id}
            authorsCount={authors.length}
            author={item}
            language={language}
            onChange={onChangeAuthor}
            onDelete={onDeleteAuthor}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default SortableAuthorList;
