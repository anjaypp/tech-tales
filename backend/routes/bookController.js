const bookModel = require("../models/bookModel");
const logger = require("../config/logger"); // Assuming the logger is in the config folder

exports.getBooks = async (req, res) => {
    try {
        // Capture the search term from the query
        const searchTerm = req.query.searchTerm?.trim() || "";

        // Set a base query to start with
        let query = { isActive: true };

        // Log the incoming request details
        logger.info("Received request to fetch books", { searchTerm });

        // If there's a search term, modify the query to filter by title or author
        if (searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: "i" } },
                { author: { $regex: searchTerm, $options: "i" } },
            ];
        }

        // Fetch the books based on the query, sorted by createdAt in descending order
        const books = await bookModel.find(query).sort({ createdAt: -1 });

        if (books.length > 0) {
            logger.info("Books fetched successfully", { count: books.length });
        } else {
            logger.warn("No books found for the search term", { searchTerm });
        }

        // Return the books in the response
        res.status(200).json({
            success: true,
            data: books
        });
    } catch (error) {
        // Log the error
        logger.error("Failed to fetch books", { error: error.message });

        // Handle errors
        res.status(500).json({
            success: false,
            message: "Failed to fetch books",
            error: error.message
        });
    }
};

//Display a specific book
exports.getaBook = async (req, res) => {
    try {
        const book = await bookModel.findById(req.params.id);

        if (!book) {
            logger.warn("Book not found", { id: req.params.id });
            return res.status(404).json({ message: "Book not found" });
        }

        logger.info("Book fetched successfully", { id: req.params.id });
        res.status(200).json({ success: true, data: book });
}
    catch (error) {
        logger.error("Failed to fetch book", { id: req.params.id, error: error.message });
        res.status(500).json({ success: false, message: "Failed to fetch book", error: error.message });
    }
};