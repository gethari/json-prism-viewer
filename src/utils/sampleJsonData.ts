
/**
 * Sample JSON data for demo purposes
 */

export const sampleJsonData = {
  original: {
    name: "Sample Original JSON",
    description: "This is a sample original JSON object for demonstration.",
    person: {
      firstName: "John",
      lastName: "Doe",
      age: 30,
      email: "john.doe@example.com",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345"
      },
      hobbies: ["reading", "hiking", "coding"],
      active: true
    },
    metadata: {
      created: "2023-01-15T08:00:00Z",
      lastModified: "2023-01-15T08:00:00Z",
      version: 1.0
    }
  },
  modified: {
    name: "Sample Modified JSON",
    description: "This is a sample modified JSON object to show differences.",
    person: {
      firstName: "John",
      lastName: "Doe",
      age: 31,  // Changed age
      email: "johndoe@newdomain.com", // Changed email
      address: {
        street: "456 Oak Avenue", // Changed street
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA" // Added country
      },
      hobbies: ["reading", "travel", "photography"], // Changed hobbies
      active: true,
      membership: "premium" // Added field
    },
    metadata: {
      created: "2023-01-15T08:00:00Z",
      lastModified: "2023-06-22T14:30:00Z", // Changed date
      version: 1.1 // Changed version
    },
    notes: "This is a new field that wasn't in the original" // Added field
  }
};

export const simpleJsonSample = {
  original: {
    id: 1,
    name: "Product",
    price: 29.99,
    inStock: true,
    colors: ["red", "blue", "green"]
  },
  modified: {
    id: 1,
    name: "Product Deluxe",
    price: 39.99,
    inStock: true,
    colors: ["red", "blue", "green", "yellow"],
    featured: true
  }
};

export const getFormattedSample = (type: 'original' | 'modified', complex: boolean = false) => {
  const data = complex ? sampleJsonData : simpleJsonSample;
  return JSON.stringify(data[type], null, 2);
};

