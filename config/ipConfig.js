const os = require("os");
function getIPv4Address() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    for (const iface of interfaceInfo) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  throw new Error("Couldn't find IPv4 address");
}
// Usage
try {
  const ipAddress = getIPv4Address();
  console.log("Your IPv4 address is:", ipAddress);
} catch (error) {
  console.error("Error getting IPv4 address:", error.message);
}

module.exports = { getIPv4Address };
