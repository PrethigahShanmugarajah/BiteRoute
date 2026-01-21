// BiteRoute / Server / socket.js
import User from "./models/userModel.js";

export const socketHandler = async (io) => {
  io.on("connection", (socket) => {
    socket.on("identity", async ({ userId }) => {
      try {
        const user = await User.findByIdAndUpdate(
          userId,
          { socketId: socket.id, isOnline: true },
          { new: true },
        );
      } catch (error) {
        console.error("Socket Handle Error:", error.message);

        return res.status(500).json({
          success: false,
          message: "",
          error: `Socket Handle Error: ${error.message}`,
        });
      }

      console.log("Socket ID:", socket.id);
      console.log("Socket Indentity:", { userId });
    });

    socket.on("updateLocation", async ({ latitude, longitude, userId }) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          isOnline: true,
          socketId: socket.id,
        });

        if (user) {
          io.emit("updateDeliveryLocation", {
            deliveryPersonId: userId,
            latitude,
            longitude,
          });
        }
      } catch (error) {
        console.error("Update Delivery Location Error:", error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          {
            socketId: null,
            isOnline: false,
          },
        );
      } catch (error) {
        console.error("Socket Handle Error:", error.message);
      }
    });
  });
};
