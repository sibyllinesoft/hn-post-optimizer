import React, { useState } from "react";
import DOMPurify from "dompurify";
import assistantAvatar from "../assets/robot.png";
import thumbsUpIcon from "../assets/thumbs-up.svg";
import thumbsDownIcon from "../assets/thumbs-down.svg";
import { useAppStore } from "../store";
import { IconButton } from "../IconButton";
import { HNPost } from "../types";

export const RelatedPostsTab: React.FC = () => {
  const {
    goodRelatedPosts,
    relevantPosts, // relevantPosts is now an object
    markAsIrrelevant,
    markAsRelevant,
    getGoodRelatedPosts,
    setActiveTab,
  } = useAppStore();

  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>(
    {}
  );

  // Toggle post expansion
  const toggleExpandedPost = (objectID: string) => {
    setExpandedPosts((prevState) => ({
      ...prevState,
      [objectID]: !prevState[objectID],
    }));
  };

  // Handle relevance toggle
  const handleRelevanceToggle = (
    e: React.MouseEvent,
    objectID: string,
    isRelevant: boolean
  ) => {
    e.stopPropagation();
    if (isRelevant) {
      markAsIrrelevant(objectID);
    } else {
      markAsRelevant(objectID);
    }
  };
  const baseStyle = goodRelatedPosts.length > 0 ? { height: "85vh" } : {};
  return (
    <div style={{ ...baseStyle, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          padding: "20px",
        }}
      >
        <div style={{ flexGrow: 1, marginRight: "20px", textAlign: "justify" }}>
          Our post optimizer can find successful Hacker News posts that are
          potentially relevant to your product or service using the tags
          provided on the previous tab. We use these to improve the quality of
          your generated post. Once you've retrieved successful posts, click the
          thumbs-up icon to mark a post as relevant and optimizer will reference
          it when crafting your post. Five to ten relevant posts is sufficient
          for good results.
        </div>
        <IconButton
          text="Get Related Posts"
          onClick={getGoodRelatedPosts}
          iconSrc={assistantAvatar}
        />
      </div>

      {/* Display the related posts */}
      {goodRelatedPosts.length > 0 && (
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            border: "1px solid #ccc",
            margin: "0 20px 20px 20px",
            padding: "10px",
            boxSizing: "border-box",
          }}
        >
          {goodRelatedPosts.map((post: HNPost) => {
            const isRelevant = relevantPosts[post.objectID] === true; // Check relevance using object
            const isExpanded = expandedPosts[post.objectID];

            return (
              <div
                key={post.objectID}
                style={{
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                  backgroundColor: isRelevant
                    ? "rgba(204, 82, 0, 0.1)"
                    : "rgb(255,255,255)",
                  cursor: "pointer",
                  borderBottom: post.story_text
                    ? "2px solid #ccc"
                    : "1px solid #ccc",
                }}
              >
                {/* Post header (clickable) */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: 5,
                  }}
                  onClick={() => toggleExpandedPost(post.objectID)}
                >
                  <div>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {post.title} ({post.points} points)
                    </a>
                  </div>
                  <button
                    onClick={(e) =>
                      handleRelevanceToggle(e, post.objectID, isRelevant)
                    }
                    style={{
                      cursor: "pointer",
                      padding: "5px",
                      border: "none",
                      background: "none",
                    }}
                  >
                    <img
                      src={isRelevant ? thumbsDownIcon : thumbsUpIcon}
                      alt={
                        isRelevant ? "Mark as irrelevant" : "Mark as relevant"
                      }
                      style={{ width: "16px" }}
                    />
                  </button>
                </div>

                {/* Expanded content with sanitized HTML */}
                {isExpanded && post.story_text && (
                  <div
                    style={{
                      backgroundColor: "#f9f9f9",
                      padding: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.story_text),
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "20px" }}
      >
        <button className="action-button" onClick={() => setActiveTab(2)}>
          Next
        </button>
      </div>
    </div>
  );
};
