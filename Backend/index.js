import express from "express";
import cors from "cors";
import db from "./db.js"; // database connection
import bcrypt from "bcryptjs"; // bcryptjs for hashing passwords
import jwt from "jsonwebtoken";
import dotenv from "dotenv"; 

dotenv.config(); // Loads environment variables from .env

const app = express();
app.use(express.json());

// Private Key
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Allow frontend requests (node http server) - type http-server on the terminal in the frontend KyotoVenture folder to start it on localhost:8080
app.use(
  cors({
    origin: ["http://127.0.0.1:8080", "http://localhost:8080"],
    credentials: true,
  })
);

// Login Route - Generates a JWT token when the user logs in
app.post("/api/login", (req, res) => {
  const { email, password } = req.body; // Gets the email and password from the request

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields." }); // Checks if email and password fields are empty.
  }

  // Find if user exists in the database
  db.query("SELECT * FROM users WHERE email = $1", [email])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(400).json({ message: "User not found." }); // Sends error response
      }

      const user = result.rows[0]; // Gets the user from the query result

      // Compares the entered password with the hashed password in the database
      bcrypt.compare(password, user.password_hash, (err, isMatch) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error verifying password." });
        }

        if (!isMatch) {
          return res.status(400).json({ message: "Invalid password." });
        }

        // Password matched, generate a JWT token to keep the user logged in
        const token = jwt.sign(
          { id: user.id, email: user.email },
          JWT_SECRET_KEY,
          {
            expiresIn: JWT_EXPIRES_IN, // Set the token expiration
          }
        );

        // Send the JWT token in the response (stored in localStorage)
        res.status(200).json({ success: true, token });
      });
    })
    .catch((err) => {
      console.error(err); // Log the error if the query fails
      res.status(500).json({ message: "Error logging in." });
    });
});

// Signup route (handle POST request from frontend)
app.post("/api/signup", (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body); // Log the request data

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }

  // Check if the user already exists (based on email)
  const query = "SELECT * FROM users WHERE email = $1";
  db.query(query, [email])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .json({ message: "User with this email already exists." });
      }

      // Hashes password before saving it to the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error hashing password." });
        }

        // Insert the new user into the database, including created_at column (timestamp for creation)
        const insertQuery = `
          INSERT INTO users (username, email, password_hash, created_at)
          VALUES ($1, $2, $3, NOW())
        `;
        db.query(insertQuery, [username, email, hashedPassword])
          .then(() => {
            res
              .status(201)
              .json({ success: true, message: "Signup successful!" });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Error saving user to database." });
          });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error checking if user exists." });
    });
});

// Middleware for verifying JWT token (to keep the user logged in)
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    // If no token is provided
    return res.status(401).json({ message: "Authentication required." }); // Return unauthorized error
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      // If token verification fails
      return res.status(403).json({ message: "Token is invalid or expired." });
    }

    req.user = user; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

// Logout Route - JWT is in localStorage
app.post("/api/logout", (req, res) => {
  // Sends a message
  res
    .status(200)
    .json({ message: "Logged out successfully. (Token cleared in frontend)" });
});

// Example protected route that requires authentication
app.get("/api/protected", authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ message: "This is a protected route.", user: req.user });
});

///////////// Itinerary Routes /////////////////

// Create an Itinerary
app.post("/api/itineraries", authenticateToken, (req, res) => {
  const {
    itinerary_name,
    destinations,
    budget,
    start_date,
    end_date,
    days_added,
  } = req.body;
  const userId = req.user.id;

  console.log("Received request:", req.body); // logs request
  console.log("User ID:", userId); // logs user ID

  if (!itinerary_name || !destinations || !budget || !start_date || !end_date) {
    return res
      .status(400)
      .json({
        message:
          "Itinerary name, destinations, budget, start date, and end date are required.",
      });
  }

  // makes sure destinations is an array
  const formattedDestinations = Array.isArray(destinations)
    ? destinations // If destinations is already an array
    : destinations.split(",").map((dest) => dest.trim()); // split by commas and remove extra spaces

  console.log("Formatted Destinations:", formattedDestinations); // log formatted destinations

  // converts destinations array to PostgreSQL-compatible array format
  const destinationsArray = `{${formattedDestinations
    .map((dest) => `"${dest}"`)
    .join(",")}}`;

  console.log("Destinations Array:", destinationsArray); // log formatted array

    // First, check if this is the user's first itinerary to determine if it should be default
    db.query("SELECT COUNT(*) FROM itineraries WHERE user_id = $1", [userId])
    .then((countResult) => {
      const isFirstItinerary = parseInt(countResult.rows[0].count) === 0;
      console.log("Is first itinerary:", isFirstItinerary);

      // If this is the first itinerary, set is_default to TRUE, otherwise FALSE
      const isDefault = isFirstItinerary;
      
      console.log("Inserting itinerary:", {
        userId,
        itinerary_name,
        destinationsArray,
        budget,
        start_date,
        end_date,
        days_added,
        isDefault
      });

      // inserts the itinerary collection into the postgresql database
      return db.query(
        "INSERT INTO itineraries (user_id, itinerary_name, destinations, budget, start_date, end_date, days_added, is_default, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *",
        [
          userId,
          itinerary_name,
          destinationsArray,
          budget,
          start_date,
          end_date,
          days_added,
          isDefault
        ]
      );
    })
    .then((result) => {
      res.status(201).json({ success: true, itinerary: result.rows[0] });
    })
    .catch((err) => {
      console.error("Error creating itinerary:", err);
      res
        .status(500)
        .json({ message: "Error creating itinerary.", error: err.message });
    });
});

// Get all itineraries for the authenticated user and also get their username
app.get("/api/itineraries", authenticateToken, (req, res) => {
  const userId = req.user.id;

  // Get username separately
  db.query("SELECT username FROM users WHERE id = $1", [userId])
    .then((userResult) => {
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "User not found." });
      }
      
      const username = userResult.rows[0].username;
      
      // Then get itineraries
      return db.query("SELECT * FROM itineraries WHERE user_id = $1 ORDER BY created_at DESC", [userId])
        .then((itinerariesResult) => {
          // Return username with itineraries (even if empty - even when theres no itinerary collections made, show the username)
          res.status(200).json({ 
            user: username, 
            itineraries: itinerariesResult.rows 
          });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ 
        message: "Error fetching itineraries.", 
        error: err.message 
      });
    });
});

// Get a specific itinerary collection by ID to display them in itinerary-collections.html after clicking view from itineraries.html
app.get("/api/itineraries/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.query("SELECT * FROM itineraries WHERE id = $1 AND user_id = $2", [
    id,
    userId,
  ])
    .then((result) => {
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Itinerary not found or not owned by user." });
      }
      res.status(200).json({ itinerary: result.rows[0] });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({
          message: "Error fetching itinerary details.",
          error: err.message,
        });
    });
});

// Update an itinerary
app.put("/api/itineraries/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const {
    itinerary_name,
    destinations,
    budget,
    start_date,
    end_date,
    days_added,
  } = req.body;
  const userId = req.user.id;

  if (days_added === undefined) {
    return res
      .status(400)
      .json({
        message: "Number of days added is required for updating itinerary.",
      });
  }

  db.query(
    "UPDATE itineraries SET itinerary_name = $1, destinations = $2, budget = $3, start_date = $4, end_date = $5, days_added = $6, updated_at = NOW() WHERE id = $7 AND user_id = $8 RETURNING *",
    [
      itinerary_name,
      destinations,
      budget,
      start_date,
      end_date,
      days_added,
      id,
      userId,
    ]
  )
    .then((result) => {
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Itinerary not found or not owned by user." });
      }
      res.status(200).json({ success: true, itinerary: result.rows[0] });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error updating itinerary.", error: err.message });
    });
});

// Delete an itinerary
app.delete("/api/itineraries/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.query(
    "DELETE FROM itineraries WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId]
  )
    .then((result) => {
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Itinerary not found or not owned by user." });
      }
      res.status(200).json({ success: true, message: "Itinerary deleted." });
    })
    .catch(() =>
      res.status(500).json({ message: "Error deleting itinerary." })
    );
});

// Set an itinerary collection as the default itinerary
app.put("/api/itineraries/default/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Remove default from any other itinerary the user has
    await db.query(
      "UPDATE itineraries SET is_default = FALSE WHERE user_id = $1",
      [userId]
    );

    // Set the selected itinerary as default itinerary
    const result = await db.query(
      "UPDATE itineraries SET is_default = TRUE WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Itinerary not found or not owned by user." });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Default itinerary updated.",
        itinerary: result.rows[0],
      });
  } catch (error) {
    console.error("Error setting default itinerary:", error);
    res.status(500).json({ message: "Error setting default itinerary." });
  }
});

/////////////////////////////////////////ACTIVITIES////////////////////////////////////////////////////
// Route for adding activities to the default itinerary the user has set
// checks if users has a default itinerary and if not: error. activities will automatically be added to Day 1
// users can switch activities to different days through edit itinerary but activities will go to Day 1 by default
// Add Activity to Default Itinerary
app.post("/api/activities/add", authenticateToken, async (req, res) => {
  const { activityId } = req.body;
  const userId = req.user.id;

  try {
    // Find the users default itinerary
    const defaultItineraryQuery = `
      SELECT id FROM itineraries WHERE user_id = $1 AND is_default = TRUE
    `;
    const result = await db.query(defaultItineraryQuery, [userId]);

    if (result.rows.length === 0) {
      return res
        .status(400)
        .json({
          error:
            "No default itinerary found. Please set a default itinerary first.",
        });
    }

    const defaultItineraryId = result.rows[0].id;

    // Check if the activity exists
    const activityQuery = `
      SELECT id FROM activities WHERE id = $1
    `;
    const activityResult = await db.query(activityQuery, [activityId]);

    if (activityResult.rows.length === 0) {
      return res.status(400).json({ error: "Activity not found" });
    }

    // Add activity to the itinerary_activities table (defaulting to Day 1)
    const addActivityQuery = `
      INSERT INTO itinerary_activities (user_id, itinerary_id, activity_id, day)
      VALUES ($1, $2, $3, 1) -- Defaulting to Day 1
    `;
    await db.query(addActivityQuery, [userId, defaultItineraryId, activityId]);

    res.status(200).json({ message: "Activity added to default itinerary" });
  } catch (error) {
    console.error("Error adding activity to itinerary:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route for fetching/getting activities linked to a specific itinerary collection. the frontend will
// display the activities for the users itinerary on the certain pages where it should show
// orders/sorts activities by the day ascending from smallest to largest
// Fetch Activities for a specific Itinerary
app.get(
  "/api/itinerary/:itineraryId/activities",
  authenticateToken,
  async (req, res) => {
    const { itineraryId } = req.params;

    try {
      const query = `
  SELECT ia.id AS itinerary_activity_id, ia.day, 
         a.id AS activity_id, a.title, a.area, 
         a.interest, a.rating, a.image_url
  FROM itinerary_activities ia
  JOIN activities a ON ia.activity_id = a.id
  WHERE ia.itinerary_id = $1
  ORDER BY ia.day ASC
`;

      const result = await db.query(query, [itineraryId]);

      // Always return a 200 status with the activities array (even if empty)
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Delete an Activity from an itinerary collection
app.delete("/api/itinerary/:itineraryId/activities/:activityId", authenticateToken, (req, res) => {
  const { itineraryId, activityId } = req.params;
  const userId = req.user.id;

  // Check if the activity exists in the itinerary
  db.query(
    "SELECT * FROM itinerary_activities WHERE itinerary_id = $1 AND activity_id = $2 AND user_id = $3",
    [itineraryId, activityId, userId]
  )
    .then((result) => {
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Activity not found in this itinerary or not owned by user." });
      }

      // Delete activity from itinerary
      db.query(
        "DELETE FROM itinerary_activities WHERE itinerary_id = $1 AND activity_id = $2 AND user_id = $3 RETURNING *",
        [itineraryId, activityId, userId]
      )
        .then(() => {
          res.status(200).json({ success: true, message: "Activity deleted from itinerary." });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Error deleting activity from itinerary.", error: err.message });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error checking activity existence.", error: err.message });
    });
});

// Update/Move an activity to a different day in the itinerary
app.put("/api/itinerary/:itineraryId/activities/:activityId/move", authenticateToken, async (req, res) => {
  const { itineraryId, activityId } = req.params;
  const { day } = req.body;
  const userId = req.user.id;

// Validation
  if (!day || isNaN(parseInt(day)) || parseInt(day) < 1) {
    return res.status(400).json({ message: "Invalid day value provided." });
  }

  try {
    // Check if the itinerary exists and belongs to the user
    const itineraryCheck = await db.query(
      "SELECT * FROM itineraries WHERE id = $1 AND user_id = $2",
      [itineraryId, userId]
    );

    if (itineraryCheck.rows.length === 0) {
      return res.status(404).json({ message: "Itinerary not found or not owned by user." });
    }

    // Check if the requested day is within the itinerary's range
    const maxDays = itineraryCheck.rows[0].days_added;
    if (parseInt(day) > maxDays) {
      return res.status(400).json({ 
        message: `Cannot move activity to day ${day}. Itinerary only has ${maxDays} days.` 
      });
    }

    // Check if activity exists in the itinerary
    const activityCheck = await db.query(
      "SELECT * FROM itinerary_activities WHERE itinerary_id = $1 AND activity_id = $2 AND user_id = $3",
      [itineraryId, activityId, userId]
    );

    if (activityCheck.rows.length === 0) {
      return res.status(404).json({ 
        message: "Activity not found in this itinerary or not owned by user." 
      });
    }

    // Update the activity's day
    const updateResult = await db.query(
      "UPDATE itinerary_activities SET day = $1 WHERE itinerary_id = $2 AND activity_id = $3 AND user_id = $4 RETURNING *",
      [day, itineraryId, activityId, userId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(500).json({ message: "Failed to update activity." });
    }

    res.status(200).json({ 
      success: true, 
      message: `Activity moved to day ${day}`,
      activity: updateResult.rows[0]
    });
  } catch (error) {
    console.error("Error moving activity:", error);
    res.status(500).json({ 
      message: "Error moving activity.", 
      error: error.message 
    });
  }
});


app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
