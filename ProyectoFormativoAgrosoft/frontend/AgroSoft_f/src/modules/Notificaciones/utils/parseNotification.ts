
export const parseNotificationMessage = (message: string) => {
  const lines = message.split("\n").filter((line) => line.trim());
  const metadata: { [key: string]: string } = {};

  lines.forEach((line) => {
    const [key, value] = line.split(":").map((part) => part.trim());
    if (key && value) {
      metadata[key.toLowerCase()] = value;
    }
  });

  return {
    title: metadata["título"] || lines[0] || "Sin título",
    description: metadata["descripción"] || "",
    date: metadata["fecha"] || "",
    type: metadata["tipo"] || "",
    status: metadata["estado"] || "",
    crop: metadata["cultivo"] || "",
  };
};