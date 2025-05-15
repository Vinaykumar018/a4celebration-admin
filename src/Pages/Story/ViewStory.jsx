import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchStoryById, fetchSubstoriesByStoryId } from "../../Services/storyApiService";
import "./ViewStory.css";

const ViewStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [substories, setSubstories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusUpdated, setStatusUpdated] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const storyResponse = await fetchStoryById(id);
        if (storyResponse && storyResponse.story) {
          setStory(storyResponse.story);
          setSelectedStatus(storyResponse.story.status || 'draft');

          const substoriesResponse = await fetchSubstoriesByStoryId(id);
          if (substoriesResponse && substoriesResponse.data) {
            setSubstories(substoriesResponse.data);
          }
        } else {
          setError(storyResponse?.message || "Failed to load story data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const getStatusClass = (status) => {
    if (!status) return "pending";

    switch (status.toLowerCase()) {
      case "active": return "completed";
      case "draft": return "pending";
      case "archived": return "cancelled";
      default: return "pending";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "N/A";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const handleUpdateStatus = async () => {
    try {
      // Add your API call to update status here
      // await updateStoryStatus(id, selectedStatus);
      setStatusUpdated(true);
      setTimeout(() => setStatusUpdated(false), 2000);
      toast.success('Status updated successfully!');
    } catch (error) {
      toast.error('Failed to update status');
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading story details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate(-1)} className="back-button bg-danger">
          <i className="fas fa-arrow-left"></i> Go Back
        </button>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="error-container">
        <div className="error-message">Story not found</div>
        <button onClick={() => navigate(-1)} className="back-button bg-danger">
          <i className="fas fa-arrow-left"></i> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="story-details-container card">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Story Header */}
      <div className="story-header">
        <h2>
          <i className="fas fa-book-open"></i> {story.title || 'Untitled Story'}
        </h2>
        <div className="story-meta">
          <span className="story-date">
            <i className="far fa-calendar-alt"></i> {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'N/A'}
          </span>
          <div className="action-buttons mt-0">
            <button onClick={() => navigate(-1)} className="back-button bg-danger">
              <i className="fas fa-arrow-left"></i> Back
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="story-content-grid">
        {/* Left Column */}
        <div className="story-left-column">
          {/* Story Image */}
          <div className="story-card">
            <div className="card-title common-flex justify-between">
              <h3>
                <i className="fas fa-image"></i> Story Cover
              </h3>
              <div className="substories-actions p-0">
                <button
                  onClick={() => navigate(`/story/edit/${id}`)}
                  className="action-btn secondary"
                >
                  <i className="fas fa-pencil"></i> Edit
                </button>
              </div>
            </div>

            <div className="story-image-container">
              {story.image ? (
                <img
                  src={`http://localhost:3000${story.image}`}
                  alt={story.title || 'Story cover'}
                  className="story-image"
                />
              ) : (
                <div className="no-image-placeholder">
                  <i className="fas fa-image"></i>
                  <span>No Cover Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Story Content */}
          <div className="story-card">
            <h3 className="card-title">
              <i className="fas fa-align-left"></i> Story Content
            </h3>
            <div
              className="story-content"
              dangerouslySetInnerHTML={{ __html: story.long_description || '<p>No content available</p>' }}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="story-right-column">

          {/* Substories Section */}
          <div className="story-card">
            <div className="card-title common-flex justify-between p-2">
              <h5>
                <i className="fas fa-layer-group"></i> Substories ({substories.length})
              </h5>
              <div className="common-flex substories-actions">

                <button
                  onClick={() => navigate(`/story/${id}/substories`)}
                  className="action-btn secondary"
                >
                  <i className="fas fa-list"></i> View
                </button>
              </div>
            </div>

            {substories.length === 0 ? (
              <div className="no-substories">
                <i className="fas fa-book-open"></i>
                <p>No substories found for this story.</p>
              </div>
            ) : (
              <div className="substories-list">
                {substories.slice(0, 3).map((substory) => (
                  <div key={substory._id} className="substory-item">
                    <div className="substory-image">
                      {substory.images && substory.images.length > 0 ? (
                        <img
                          src={`http://localhost:3000${substory.images[0]}`}
                          alt={substory.title || 'Substory'}
                        />
                      ) : (
                        <div className="no-image">
                          <i className="fas fa-image"></i>
                        </div>
                      )}
                    </div>
                    <div className="substory-details">
                      <h4>{substory.title || 'Untitled Substory'}</h4>
                      <p className="substory-description">
                        {substory.description && substory.description.length > 100
                          ? `${substory.description.substring(0, 100)}...`
                          : substory.description || 'No description available'}
                      </p>
                      <button
                        onClick={() => navigate(`/story/${id}/substories/${substory._id}`)}
                        className="view-details-btn"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Information */}
          <div className="story-card">
            <h3 className="card-title">
              <i className="fas fa-tag"></i> Category Details
            </h3>
            <div className="category-info">
              <div className="info-row">
                <span className="info-label">Category:</span>
                <span className="info-value">{story.category?.title || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Meta Title:</span>
                <span className="info-value">{story.metaTitle || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Meta Keywords:</span>
                <span className="info-value">{story.metaKeywords || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Featured:</span>
                <span className="info-value">{story.isFeatured ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStory;