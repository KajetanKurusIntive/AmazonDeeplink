import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import logo from "./logo.png"; // Import your PNG image

function AmazonIntentBuilder() {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState("");
  const [convertedData, setConvertedData] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Define mapping of themes to ASIN values
  const themeToAsin = {
    localnow: "B01MQTVN2T",
    twc: "B07PNRRTN6",
    hbcugo: "ASINhbcugo",
    thegrio: "ASIN4thegrio",
  };

  const themeToTitle = {
    localnow: "Local Now",
    twc: "The Weather Channel",
    hbcugo: "HBCU GO",
    thegrio: "The Grio",
  };

  // Extract theme and ASIN values from URL parameters
  const searchParams = new URLSearchParams(location.search);
  let theme = searchParams.get("theme") || "localnow";
  const asin = searchParams.get("asin") || themeToAsin[theme] || "";

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const amazonIntentBuilder = (formData) => {
    const { intent } = formData;

    // Extract the value of the "-d" parameter if present and remove quotes
    const match = intent.match(/-d\s+("[^"]*"|[^"'\s]+)/);
    if (match) {
      const value = match[1].replace(/"/g, ""); // Remove quotes from the value
      const deeplink = `amzns://apps/android?asin=${asin}#Intent;S.intentToFwd=${encodeURIComponent(
        value
      )};end`;
      setData(deeplink);
      return;
    }

    // If "-d" parameter not found, build deeplink using the entire provided string
    const deeplink = `amzns://apps/android?asin=${asin}#Intent;S.intentToFwd=${encodeURIComponent(
      intent
    )};end`;
    setData(deeplink);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split("\n"); // Split content by lines

      // Process content and convert to Amazon Deeplinks
      const convertedDeeplinks = lines.map((line) => {
        const match = line.match(/-d\s+("[^"]*"|[^"'\s]+)/);
        if (match) {
          const value = match[1].replace(/"/g, ""); // Remove quotes from the value
          return `amzns://apps/android?asin=${asin}#Intent;S.intentToFwd=${encodeURIComponent(
            value
          )};end`;
        } else {
          return `amzns://apps/android?asin=${asin}#Intent;S.intentToFwd=${encodeURIComponent(
            line
          )};end`;
        }
      });

      // Set converted data
      setConvertedData(convertedDeeplinks.join("\n"));
    };

    reader.readAsText(file);
  };

  const handleDownload = () => {
    // Prepare the content for download
    const content = convertedData; // This should be the converted Amazon Deeplinks
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "converted_deeplinks.txt";
    document.body.appendChild(element); // Required for Firefox
    element.click();
  };

  const handleThemeChange = (newTheme) => {
    // Update the theme parameter in the URL and reload the page
    theme = newTheme;
    const newAsin = themeToAsin[newTheme] || "";
    navigate(`/?theme=${newTheme}&asin=${newAsin}`);
    // Reload the page

    window.location.reload();
  };

  return (
    <div className={`App ${theme}`}>
      <div className="theme-section">
        <div>
          <button
            className="theme-button localnow"
            onClick={() => handleThemeChange("localnow")}
          ></button>
          <button
            className="theme-button twc"
            onClick={() => handleThemeChange("twc")}
          ></button>
          <button
            className="theme-button thegrio"
            onClick={() => handleThemeChange("thegrio")}
          ></button>
          <button
            className="theme-button hbcugo"
            onClick={() => handleThemeChange("hbcugo")}
          ></button>
        </div>
      </div>
      <h1>Amazon Deeplink Converter for {themeToTitle[theme]}</h1>
      <p>Create single deeplink</p>
      <form
        className="intent-form"
        onSubmit={handleSubmit(amazonIntentBuilder)}
      >
        <textarea
          className="intent-textarea"
          {...register("intent")}
          placeholder="Android deeplink / intent data"
        />
        <input className="submit-button" type="submit" value="Convert" />
      </form>
      <div>
        <code>{data}</code>
      </div>
      <hr className="divider" />
      <p>
        You can now upload bulk data for conversion by selecting a file using
        the "Upload Bulk Data" button below.
      </p>
      <div className="file-upload">
        <label htmlFor="file-upload" className="file-upload-label">
          Upload Bulk Data
        </label>
        <input id="file-upload" type="file" onChange={handleFileUpload} />
      </div>

      <div className="download-button">
        <button onClick={handleDownload} disabled={!convertedData}>
          Download Converted Deeplinks
        </button>
      </div>

      <div className="faq-section">
        <h2>FAQ</h2>
        <h3>How to use it?</h3>
        <p>
          You can provide either the entire Deeplink or just the content of the{" "}
          <code>-d</code> parameter.
        </p>
        <p>Example Android Deeplink:</p>
        <code>
          adb shell am start -a android.intent.action.VIEW -d
          "{theme}://player/the-contract"
          com.amazon.rialto.cordova.webapp.webapp{theme}
        </code>
        <p>
          Content of <code>-d</code> parameter example:
        </p>
        <code>{theme}://player/vod-title</code>
        <h3>How to create and upload bulk data?</h3>
        <p>
          To create a bulk data file, simply list each Deeplink or intent data
          in a separate line within a text file.
        </p>
        <p>
          Then, use the "Upload Bulk Data" button to select and upload the file
          for conversion.
        </p>
        <p>
          Once the conversion is complete, you can download the converted
          Deeplinks using the "Download Converted Deeplinks" button.
        </p>
      </div>
    </div>
  );
}

export default AmazonIntentBuilder;
