import React, { useEffect, useState } from "react";

const MainPage = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(3);

  const [emailId, setEmailId] = useState("");

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("jsonData"));
    if (localData != null) {
      setRecords(localData);
      setFilteredRecords(localData); // Initialize filteredRecords
    }
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = records.filter(
      (record) =>
        record.id.toString().includes(query) ||
        record.name.toLowerCase().includes(query) ||
        record.email.toLowerCase().includes(query)
    );

    setFilteredRecords(filtered);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Get current records for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handleUpdate = (id, updatedField) => {
    if (updatedField.email) {
      const isThere = records.some((e) => e.email == emailId);
      if (isThere) {
        alert("Email already exists");
        return;
      }
      const updatedRecords = records.map((record, index) =>
        index === id ? { ...record, ...updatedField } : record
      );
      setRecords(updatedRecords);
      setFilteredRecords(updatedRecords); // Sync filteredRecords
      localStorage.setItem("jsonData", JSON.stringify(updatedRecords));
    } else {
      const updatedRecords = records.map((record, index) =>
        index === id ? { ...record, ...updatedField } : record
      );
      setRecords(updatedRecords);
      setFilteredRecords(updatedRecords); // Sync filteredRecords
      localStorage.setItem("jsonData", JSON.stringify(updatedRecords));
    }
  };

  const handleDelete = (id) => {
    const updatedRecords = records.filter((record, index) => index !== id);
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords); // Sync filteredRecords
    localStorage.setItem("jsonData", JSON.stringify(updatedRecords));

    // Adjust pagination if the last record on the page is deleted
    if (currentRecords.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  function removeDuplicates(data) {
    const seen = new Set();
    return data.filter((item) => {
      // Define a unique key for each object (e.g., combine multiple properties if needed)
      const key = item.email || JSON.stringify(item); // Example: Use email or serialize the entire object
      if (seen.has(key)) {
        return false; // Skip duplicates
      }
      seen.add(key);
      return true;
    });
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Read the file as text
    const text = await file.text();
    let jsonData;

    try {
      // Parse JSON
      jsonData = JSON.parse(text);
    } catch (error) {
      console.error("Invalid JSON file:", error);
      return;
    }

    // Remove duplicates
    const uniqueData = removeDuplicates(jsonData);

    const jd = JSON.parse(localStorage.getItem("jsonData"));

    if (jd == null || jd.length == 0) {
      localStorage.setItem("jsonData", JSON.stringify(uniqueData));
      setRecords(uniqueData);
      setFilteredRecords(uniqueData);
      alert("ADDED SUCCESSFULLY");
    } else {
      if (jd.length) {
        jd.push(...uniqueData);
        const udata = removeDuplicates(jd);
        setRecords(udata);
        setFilteredRecords(udata);
        localStorage.setItem("jsonData", JSON.stringify(udata));
        alert("ADDED SUCCESSFULLY");
      }
    }
  };

  return (
    <>
      <h2>Upload Your JSON File</h2>
      <input type="file" onChange={handleFileChange} />
      <h2>Manage Your Records</h2>
      <div className="p-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by ID, Name, or Email"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchQuery}
          onChange={handleSearch}
        />

        {/* Records List */}
        <ul className="mt-4 space-y-2">
          {currentRecords.map((record, index) => (
            <li key={index} className="p-3 bg-gray-100 rounded-md shadow-sm">
              <p>
                <strong>ID:</strong> {record.id}
              </p>
              <p>
                <strong>Name:</strong> {record.name}
              </p>
              <p>
                <strong>Email:</strong> {record.email}
              </p>

              <input
                type="text"
                placeholder="Enter new name or email"
                onChange={(e) => setEmailId(e.target.value)}
              />
              <button
                onClick={() => handleUpdate(index, { name: emailId })}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Update Name
              </button>
              <button
                onClick={() => handleUpdate(index, { email: emailId })}
                className="mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded-md"
              >
                Update Email
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </li>
          ))}
          {currentRecords.length === 0 && (
            <p className="text-gray-500">No records found.</p>
          )}
        </ul>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`px-3 py-1 rounded-md shadow-sm ${
                    currentPage === pageNumber
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MainPage;
