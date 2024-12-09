import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";

export default function Home() {
  const urlFormat = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [metaTags, setMetaTags] = useState(null);
  const [editableMetaTags, setEditableMetaTags] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e) => {
    const input = e.target.value;
    if (!urlFormat.test(input)) {
      setError("Invalid URL format");
    } else {
      setError("");
    }
    setUrl(input);
    setMetaTags(null);
  };

  const fetchMetaTags = async (url) => {
    setIsLoading(true);
    setIsError(false);
  
    try {
      if (!url || !urlFormat.test(url)) {
        throw new Error("Invalid URL format");
      }
  
      const { data } = await axios.post("https://react-metadata-scrapper-backend.onrender.com", {
        url: url,
      });
  
      console.log("API Response:", data); // Log the API response
  
      const defaultTags = {
        title: `${data.ogTitle}`,
        description: `${data.ogDescription && data.ogDescription.length > 160 ? data.ogDescription.substring(0, 160) + "..." : "data.ogDescription"}`,
        "og:url": "",
        "og:type": "",
        "og:title": `${data.ogTitle}`,
        "og:description": "",
        "og:image": "",
        "twitter:card": "",
        "twitter:url": "",
        "twitter:title": "",
        "twitter:description": "",
        "twitter:image": "",
      };
  
      const fetchedTags = data || {};
      const combinedTags = { ...defaultTags, ...fetchedTags };
  
      console.log("Combined Tags:", combinedTags); // Log combined tags to confirm
  
      setMetaTags(combinedTags);
      setEditableMetaTags(combinedTags); // Update state for text fields
    } catch (error) {
      console.error("Error fetching meta tags:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  const handleCheckWebsite = () => {
    if (!url || error) {
      return;
    }
    fetchMetaTags(url);
  };

  const handleEditableInputChange = (e, key) => {
    const { value } = e.target;
    setEditableMetaTags((prevTags) => ({
      ...prevTags,
      [key]: value,
    }));
  };

  const renderMetaTags = () => {
    if (!metaTags) return null;

    return (
      <Box
        sx={{
          padding: "10px",
          backgroundColor: "#2d2d2d",
          color: "#f8f8f2",
          borderRadius: "5px",
          fontFamily: "monospace",
          fontSize: "14px",
          lineHeight: "1.5",
          border: "1px solid #6272a4",
        }}
      >
        <Typography
          sx={{ color: "#6272a4" }}
        >{`<!-- HTML Meta Tags -->`}</Typography>
        <Typography sx={{ paddingLeft: "10px" }}>{`<title>${
          editableMetaTags.data.ogTitle || "No title"
        }</title>`}</Typography>
        <Typography
          sx={{ paddingLeft: "10px" }}
        >{`<meta name="description" content="${
          editableMetaTags.data.ogDescription || ""
        }" />`}</Typography>
        <Typography
          sx={{ color: "#6272a4", marginTop: "10px" }}
        >{`<!-- Facebook Meta Tags -->`}</Typography>
        <Typography
          sx={{ paddingLeft: "10px" }}
        >{`<meta property="og:url" content="${
          editableMetaTags.data.requestUrl || ""
        }" />`}</Typography>
        <Typography
          sx={{ paddingLeft: "10px" }}
        >{`<meta property="og:type" content="${
          editableMetaTags["og:type"] || ""
        }" />`}</Typography>
        <Typography
          sx={{ paddingLeft: "10px" }}
        >{`<meta property="og:title" content="${
          editableMetaTags["og:title"] || ""
        }" />`}</Typography>
        <Typography
          sx={{ paddingLeft: "10px" }}
        >{`<meta property="og:description" content="${
          editableMetaTags["og:description"] || ""
        }" />`}</Typography>
        <Typography
          sx={{ paddingLeft: "10px" }}
        >{`<meta property="og:image" content="${
          editableMetaTags["og:image"] || ""
        }" />`}</Typography>
        <Typography
          sx={{ color: "#6272a4", marginTop: "10px" }}
        >{`<!-- Twitter Meta Tags -->`}</Typography>
        <Typography
          sx={{ paddingLeft: "10px" }}
        >{`<meta name="twitter:card" content="${
          editableMetaTags["twitter:card"] || ""
        }" />`}</Typography>
        <Typography
          sx={{ paddingLeft: "10px" }}
        >{`<meta name="twitter:url" content="${
          editableMetaTags["twitter:url"] || ""
        }" />`}</Typography>
        <Typography
          sx={{ paddingLeft: "10px" }}
        >{`<meta name="twitter:title" content="${
          editableMetaTags["twitter:title"] || ""
        }" />`}</Typography>
        <Typography
          sx={{ paddingLeft: "10px" }}
        >{`<meta name="twitter:description" content="${
          editableMetaTags["twitter:description"] || ""
        }" />`}</Typography>
        <Typography
          sx={{ paddingLeft: "10px" }}
        >{`<meta name="twitter:image" content="${
          editableMetaTags["twitter:image"] || ""
        }" />`}</Typography>
      </Box>
    );
  };

  const renderEditableFields = () => {
    if (!editableMetaTags) return null;

    return (
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="h6">Edit Meta Tags:</Typography>
        {[
          "title",
          "description",
          "og:url",
          "twitter:url",
          "twitter:title",
          "twitter:description",
        ].map((key) => (
            <TextField
            key={key}
            label={key
              .replace(/_/g, " ")
              .replace(/^\w/, (c) => c.toUpperCase())}
            value={editableMetaTags[key] || ""} // Data will appear here
            onChange={(e) => handleEditableInputChange(e, key)}
            fullWidth
            sx={{
              marginBottom: "10px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#6272a4",
                },
                "&:hover fieldset": {
                  borderColor: "#50fa7b",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#bd93f9",
                },
              },
            }}
          />
          
        ))}
      </Box>
    );
  };

  return (
    <div style={{ padding: "20px", height: "100vh" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{ color: "gainsboro", fontWeight: "bolder" }}
      >
        Try The Free Meta Tag Generator
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <TextField
          value={url}
          onChange={handleInputChange}
          label="Enter website URL"
          fullWidth
          error={!!error}
          helperText={error}
          style={{
            marginBottom: "20px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#6272a4" },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckWebsite}
          disabled={!url || !!error}
          style={{ marginBottom: "20px" }}
        >
          Check Website
        </Button>
      </div>

      {isLoading && <p>Loading meta tags...</p>}
      {isError && <p style={{ color: "red" }}>Error fetching meta tags</p>}

      {metaTags && (
        <Paper
          elevation={3}
          sx={{
            padding: "20px",
            marginTop: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
            border: "1px solid #6272a4",
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            align="center"
            fontWeight="bolder"
          >
            Scraped Meta Tags:
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <Box
              sx={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "5px",
                border: "1px solid #6272a4",
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: "#e3e3e3",
                },
              }}
            >
              {renderEditableFields()}
            </Box>

            <Box
              sx={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "5px",
                border: "1px solid #6272a4",
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: "#e3e3e3",
                },
              }}
            >
              {renderMetaTags()}
            </Box>
          </Box>
        </Paper>
      )}
    </div>
  );
}