import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Send, Loader2, Upload, Crop, X, Image as ImageIcon } from "lucide-react";
import StepAccordion from "./StepAccordion";
import GraphVisualizer from "./GraphVisualizer";

const EXAMPLE_QUESTIONS = [
  "Solve the quadratic equation: x² - 5x + 6 = 0",
  "Find the derivative of: f(x) = 3x³ - 2x² + 5x - 1",
  "Draw the graph of the function: y = 2x + 3",
  "Solve the system: 2x + y = 7 and x - y = 2",
];

const MathSolver = () => {
  const location = useLocation();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState(null);
  const [inputMode, setInputMode] = useState("text"); // 'text' or 'image'

  // Image upload states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", x: 25, y: 25, width: 50, height: 50 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  // If coming from history, pre-fill the question
  useEffect(() => {
    if (location.state?.question) {
      setQuestion(location.state.question);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSolve = async (e) => {
    e.preventDefault();

    if (inputMode === "text" && !question.trim()) {
      toast.error("Please enter a math question");
      return;
    }

    if (inputMode === "image" && !selectedImage) {
      toast.error("Please upload an image");
      return;
    }

    setLoading(true);
    setSolution(null);

    try {
      const formData = new FormData();

      if (inputMode === "image") {
        const croppedBlob = await getCroppedImg();
        if (croppedBlob) {
          formData.append("image", croppedBlob, "cropped-image.jpg");
        } else {
          const res = await fetch(selectedImage);
          const blob = await res.blob();
          formData.append("image", blob, "image.jpg");
        }
      } else {
        formData.append("question", question.trim());
      }

      const response = await axios.post("/api/solve", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setSolution(response.data.data);
        toast.success("Problem solved!");
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to solve the problem");
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (example) => {
    setQuestion(example);
    setSolution(null);
  };

  const clearAll = () => {
    setQuestion("");
    setSolution(null);
    setLoading(false);
    setSelectedImage(null);
    setImagePreview(null);
    setCompletedCrop(null);
    setInputMode("text");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setImagePreview(reader.result);
      setCrop({ unit: "%", x: 25, y: 25, width: 50, height: 50 });
      setCompletedCrop(null);
      setShowCropModal(true);
      setInputMode("image");
    };
    reader.readAsDataURL(file);
  };

  const applyCrop = () => {
    if (!completedCrop || !imgRef.current || !completedCrop.width || !completedCrop.height) {
      toast.error("Please select a crop area first");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        setSelectedImage(URL.createObjectURL(blob));
        setImagePreview(URL.createObjectURL(blob));
        setShowCropModal(false);
        toast.success("Image cropped!");
      }
    }, "image/jpeg", 0.95);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setCompletedCrop(null);
    setInputMode("text");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getCroppedImg = () => {
    if (!completedCrop || !imgRef.current || !completedCrop.width || !completedCrop.height) {
      return null;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95);
    });
  };

  const getTopicColor = (topic) => {
    const colors = {
      Calculus: "from-purple-500 to-pink-500",
      Algebra: "from-blue-500 to-cyan-500",
      Geometry: "from-green-500 to-emerald-500",
      Trigonometry: "from-orange-500 to-red-500",
      Probability: "from-yellow-500 to-orange-500",
      default: "from-accent-purple to-accent-blue",
    };
    return colors[topic] || colors.default;
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Input Section */}
      <div className="glass-effect rounded-2xl p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Ask Your Question</h2>

        {/* Text / Image toggle */}
        <div className="flex items-center p-1 bg-dark-hover rounded-xl border border-dark-border mb-5">
          <button
            onClick={() => setInputMode("text")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              inputMode === "text"
                ? "bg-gradient-to-r from-accent-purple to-accent-blue text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setInputMode("image")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              inputMode === "image"
                ? "bg-gradient-to-r from-accent-purple to-accent-blue text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Image
          </button>
        </div>

        <form onSubmit={handleSolve} className="space-y-4">
          {inputMode === "text" ? (
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter any math problem..."
              className="input-dark w-full rounded-xl p-4 resize-none h-32 md:h-40"
              disabled={loading}
            />
          ) : (
            <div>
              {!selectedImage ? (
                <div className="border-2 border-dashed border-dark-border rounded-xl p-10 text-center hover:border-accent-purple/50 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Upload an image of your math problem</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="btn-primary px-6 py-2.5 rounded-xl cursor-pointer inline-block"
                  >
                    Choose Image
                  </label>
                  <p className="text-xs text-gray-500 mt-3">JPG, PNG — max 10MB</p>
                </div>
              ) : (
                <div className="border border-dark-border rounded-xl p-4">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Uploaded problem"
                      className="w-full max-h-72 object-contain rounded-lg"
                    />
                    <div className="flex gap-2 mt-3 justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setCrop({ unit: "%", x: 25, y: 25, width: 50, height: 50 });
                          setCompletedCrop(null);
                          setShowCropModal(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm bg-accent-purple/20 text-accent-purple border border-accent-purple/30 rounded-lg hover:bg-accent-purple/30 transition-colors"
                      >
                        <Crop className="w-4 h-4" />
                        Crop
                      </button>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              (inputMode === "text" && !question.trim()) ||
              (inputMode === "image" && !selectedImage)
            }
            className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Solving...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Solve Problem
              </>
            )}
          </button>

          <button
            type="button"
            onClick={clearAll}
            disabled={loading || (!question.trim() && !selectedImage && !solution)}
            className="btn-secondary w-full py-2.5 rounded-xl"
          >
            Clear
          </button>
        </form>

        {/* Example questions */}
        {inputMode === "text" && (
          <div className="mt-5">
            <p className="text-sm text-gray-400 mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUESTIONS.map((example, index) => (
                <button
                  key={index}
                  onClick={() => loadExample(example)}
                  className="btn-secondary px-3 py-1.5 rounded-lg text-xs"
                  disabled={loading}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="glass-effect rounded-2xl p-10 text-center">
          <Loader2 className="w-10 h-10 text-accent-purple animate-spin mx-auto mb-4" />
          <p className="text-gray-300 font-medium">Solving your problem...</p>
        </div>
      )}

      {/* Solution */}
      {solution && !loading && (
        <div className="space-y-4">
          {/* Final Answer */}
          <div className="glass-effect rounded-2xl p-4 md:p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold">Solution</h2>
              {solution.topic && (
                <span className={`topic-badge ${getTopicColor(solution.topic)}`}>
                  {solution.topic}
                </span>
              )}
            </div>
            <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Final Answer:</p>
              <p
                className="text-xl font-bold text-accent-green whitespace-pre-line"
                style={{ wordBreak: "break-word" }}
              >
                {solution.finalAnswer}
              </p>
            </div>
          </div>

          {/* Steps */}
          {solution.steps && solution.steps.length > 0 && (
            <StepAccordion steps={solution.steps} />
          )}

          {/* Graph */}
          {solution.graphData && solution.graphData.type !== "none" && (
            <GraphVisualizer graphData={solution.graphData} />
          )}
        </div>
      )}

      {/* Empty state */}
      {!solution && !loading && (
        <div className="glass-effect rounded-2xl p-10 text-center">
          <p className="text-lg font-medium text-gray-300 mb-1">Ready to solve!</p>
          <p className="text-gray-400 text-sm">Type a math problem above or try an example.</p>
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-auto border border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Crop Image</h3>
              <button
                onClick={() => setShowCropModal(false)}
                className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Select the area containing your math problem
            </p>
            {imagePreview && (
              <div className="bg-dark-hover rounded-xl p-4 mb-4">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img
                    ref={imgRef}
                    src={imagePreview}
                    alt="Crop preview"
                    className="max-w-full max-h-96 object-contain rounded-lg"
                    onLoad={() =>
                      setCrop({ unit: "%", x: 25, y: 25, width: 50, height: 50 })
                    }
                  />
                </ReactCrop>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCropModal(false)}
                className="btn-secondary px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="btn-primary px-5 py-2 rounded-lg flex items-center gap-2"
              >
                <Crop className="w-4 h-4" />
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathSolver;
