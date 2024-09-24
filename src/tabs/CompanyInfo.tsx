import { TagBox } from "../TagBox";
import { useAppStore } from "../store";

export const CompanyInfoTab = () => {
  const { details, setDetails, setActiveTab } = useAppStore();

  return (
    <div>
      {/* Instructions for product/company details */}
      <p>
        Paste relevant information about the post you'd like to create into the
        box below. An unstructured, unedited info dump is perfectly fine!
      </p>

      {/* Label for the textarea */}
      <label
        htmlFor="companyDetails"
        style={{ display: "block", fontWeight: "bold", marginBottom: "10px" }}
      >
        Product or company details
      </label>

      {/* Textarea for product/company details */}
      <textarea
        id="companyDetails"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Enter some details..."
        style={{
          width: "100%",
          height: "100px",
          padding: "10px",
          boxSizing: "border-box",
          marginBottom: "20px",
        }}
      />
      <label
        style={{ display: "block", fontWeight: "bold", marginBottom: "10px" }}
      >
        Tags
      </label>
      <TagBox />

      <div style={{ display: "flex", width: "100%", marginTop: 20 }}>
        <div style={{ textAlign: "right", flexGrow: 1 }}>
          <button className="action-button" onClick={() => setActiveTab(1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
