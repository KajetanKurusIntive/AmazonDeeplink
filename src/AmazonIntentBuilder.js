import React, { useState } from "react";
import { useForm } from "react-hook-form";
import logo from "./logo.png"; // Import your PNG image

function AmazonIntentBuilder() {
  console.log("rendering");
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState("");
  const [convertedData, setConvertedData] = useState("");

  const amazonIntentBuilder = (formData) => {
    const { intent } = formData;

    // Extract the value of the "-d" parameter if present and remove quotes
    const match = intent.match(/-d\s+("[^"]*"|[^"'\s]+)/);
    if (match) {
      const value = match[1].replace(/"/g, ""); // Remove quotes from the value
      const deeplink = `amzns://apps/android?asin=B01MQTVN2T#Intent;S.intentToFwd=${encodeURIComponent(
        value
      )};end`;
      setData(deeplink);
      return;
    }

    // If "-d" parameter not found, build deeplink using the entire provided string
    const deeplink = `amzns://apps/android?asin=B01MQTVN2T#Intent;S.intentToFwd=${encodeURIComponent(
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
          return `amzns://apps/android?asin=B01MQTVN2T#Intent;S.intentToFwd=${encodeURIComponent(
            value
          )};end`;
        } else {
          return `amzns://apps/android?asin=B01MQTVN2T#Intent;S.intentToFwd=${encodeURIComponent(
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

  return (
    <div className="App">
      <img src={logo} alt="Logo" width="400" height="400" />
      <h1>Amazon Deeplink Converter</h1>
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
          "localnow://player/the-contract"
          com.amazon.rialto.cordova.webapp.webapp58f7ba22e0b346d9af55652dd3187ba4
        </code>
        <p>
          Content of <code>-d</code> parameter example:
        </p>
        <code>localnow://player/the-contract</code>
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
