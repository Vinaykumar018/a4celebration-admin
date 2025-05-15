import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getBhajanById, fetchVideos } from "../../Services/BhajanMandalApiService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '../../../context/AppContext';
import RichTextEditor from "react-rte";

const PreviewMandal = () => {
  const { id } = useParams();
  const [bhajanData, setBhajanData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const { globalContextBhajanMandalCategoryData } = useContext(AppContext);

  const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoaXZhbnNodSIsImlhdCI6MTczMjE2NTMzOX0.YDu6P4alpQB5QL-74z1jO4LGfEwZA_n_Y29o512FrM8';
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

  const fetchVideosData = async () => {
    try {
      const videosResponse = await fetchVideos(id);
      setVideos(videosResponse.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleEdit = (video) => {
    setCurrentVideo(video);
    setShowEditModal(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const payload = {
      video_id: currentVideo._id,
      bhajan_mandal_id: currentVideo.bhajan_mandal_id,
      video_url: event.target.video_url.value,
      title: event.target.title.value,
      date: event.target.date.value,
    };

    try {
      const response = await fetch(`${BASE_URL}/bhajanMandal/edit-video`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Video updated successfully");
        setShowEditModal(false);
        fetchVideosData();
      } else {
        toast.error("Failed to update video: " + result.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the video");
    }
  };

  const handleDelete = async (videoId) => {
    try {
      const response = await fetch(`${BASE_URL}/bhajanMandal/delete/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        toast.success("Video deleted successfully");
        fetchVideosData();
      } else {
        toast.error("Failed to delete video");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the video");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bhajan = await getBhajanById(id);
        setBhajanData(bhajan.data);
        fetchVideosData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  if (!bhajanData) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <ToastContainer />

      {/* Main Card */}
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Bhajan Mandali Details</h4>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Left Column - Details */}
            <div className="col-md-8">
              <div className="row">
                {/* Owner Information */}
                <div className="col-md-6 mb-3">
                  <h6 className="text-muted">Owner Information</h6>
                  <div className="border p-3 rounded">
                    <p><strong>Name:</strong> {bhajanData.owner_name}</p>
                    <p><strong>Email:</strong> {bhajanData.owner_email}</p>
                    <p><strong>Phone:</strong> {bhajanData.owner_phone}</p>
                  </div>
                </div>

                {/* Mandali Information */}
                <div className="col-md-6 mb-3">
                  <h6 className="text-muted">Mandali Information</h6>
                  <div className="border p-3 rounded">
                    <p><strong>Name:</strong> {bhajanData.bhajan_name}</p>
                    <p><strong>Category:</strong> {
                      globalContextBhajanMandalCategoryData.find(
                        item => item._id === bhajanData.bhajan_category
                      )?.category || "-"
                    }</p>
                    <p><strong>Members:</strong> {bhajanData.bhajan_member}</p>
                    <p><strong>Price:</strong> ₹{bhajanData.bhajan_price}</p>
                    <p><strong>Experience:</strong> {bhajanData.exp_year} years</p>
                  </div>
                </div>

                {/* Address Information */}
                <div className="col-12 mb-3">
                  <h6 className="text-muted">Address Information</h6>
                  <div className="border p-3 rounded">
                    <p><strong>Address:</strong> {bhajanData.address}, {bhajanData.area}, {bhajanData.city}</p>
                    <p><strong>Location:</strong> {bhajanData.location}</p>
                    <p><strong>State:</strong> {bhajanData.state}, <strong>Country:</strong> {bhajanData.country}</p>
                    <p><strong>Pin Code:</strong> {bhajanData.pin_code}</p>
                  </div>
                </div>

                {/* Descriptions */}
                <div className="col-md-6 mb-3">
                  <h6 className="text-muted">Short Description</h6>
                  <div className="border p-3 rounded" dangerouslySetInnerHTML={{ __html: bhajanData.short_discription }} />
                </div>

                <div className="col-md-6 mb-3">
                  <h6 className="text-muted">Long Description</h6>
                  <div className="border p-3 rounded" dangerouslySetInnerHTML={{ __html: bhajanData.long_discription }} />
                </div>
              </div>
            </div>

            {/* Right Column - Image and Status */}
            <div className="col-md-4">
              <div className="card mb-3">
                <img
                  src={`http://localhost:3000${bhajanData.bhajan_image}`}
                  alt={bhajanData.bhajan_name}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">Status</h5>
                  <span className={`badge ${bhajanData.status === "1" ? "bg-success" : "bg-danger"}`}>
                    {bhajanData.status === "1" ? "Active" : "Inactive"}
                  </span>
                  <p className="card-text mt-2">
                    <small className="text-muted">
                      Created: {new Date(bhajanData.created_at).toLocaleString()}
                    </small>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Updated: {new Date(bhajanData.updated_at).toLocaleString()}
                    </small>
                  </p>
                  <a
                    href={`/${bhajanData.slug_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    View Public Page
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Videos Section */}
          <div className="card mt-4">
            <div className="card-header">
              <h4 className="card-title">Mandali Videos</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Video URL</th>
                      <th>Date</th>
                      <th>Uploaded At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video) => (
                      <tr key={video._id}>
                        <td>{video.title}</td>
                        <td>
                          <a
                            href={video.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            Watch
                          </a>
                        </td>
                        <td>{new Date(video.date).toLocaleDateString()}</td>
                        <td>{new Date(video.uploaded_at).toLocaleString()}</td>
                        <td>
                          <button
                            onClick={() => handleEdit(video)}
                            className="btn btn-sm btn-outline-info me-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(video._id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Video Modal */}
      {showEditModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Video</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      defaultValue={currentVideo?.title}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Video URL</label>
                    <input
                      type="url"
                      className="form-control"
                      name="video_url"
                      defaultValue={currentVideo?.video_url}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      defaultValue={currentVideo?.date.split('T')[0]}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">Save changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewMandal;