import assistantAvatar from "./assets/robot.png";
import { WithContext as ReactTagInput } from "react-tag-input";
import { useAppStore } from "./store"; // Import Zustand store hook
import { Tag } from "./types";
import { IconButton } from "./IconButton";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export const TagBox: React.FC = () => {
  const { tags, setTags, generateTags } = useAppStore(); // Get the necessary actions and state from the store

  const handleDelete = (i: number) => {
    setTags(tags.filter((_, index) => index !== i));
  };

  const handleAddition = (tag: Tag) => {
    setTags([...tags, tag]);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ minWidth: "50%" }}>
        <ReactTagInput
          tags={tags as any}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition as any}
          inputFieldPosition="bottom"
          placeholder="Type your tags and press enter or comma"
          classNames={{
            tags: "tags",
            tagInput: "tag-input",
            tagInputField: "tag-input-field",
            selected: "tag-selected",
            tag: "tag",
            remove: "remove",
            suggestions: "suggestions",
            activeSuggestion: "active-suggestion",
            editTagInput: "edit-tag-input",
            editTagInputField: "edit-tag-input-field",
            clearAll: "clear-all",
          }}
        />
      </div>
      <div style={{ textAlign: "justify", marginRight: 8 }}>
        The optimizer uses these tags to find related Hacker News posts. Three
        to five is sufficient.
      </div>
      <IconButton
        onClick={generateTags}
        iconSrc={assistantAvatar}
        text="Suggest Keywords"
      />
    </div>
  );
};
