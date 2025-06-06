interface ArtifactData {
	file: string;
	index: number;
	before: Record<string, any>;
	after: Record<string, any>;
	meta?: Record<string, any>;
}

export async function fetchGitHubArtifact(
	url: string,
): Promise<ArtifactData | null> {
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch artifact: ${response.status} ${response.statusText}`,
			);
		}

		const data = await response.json();

		// Validate the structure of the artifact data
		if (!data.before || !data.after) {
			throw new Error(
				"Invalid artifact format: missing 'before' or 'after' properties",
			);
		}

		return data as ArtifactData;
	} catch (error) {
		console.error("Error fetching GitHub artifact:", error);
		return null;
	}
}

export function decodeBase64Json(
	base64String: string,
): Record<string, any> | null {
	try {
		// 1. Decode base64 to get escaped JSON string
		const escapedJson = atob(base64String);

		// 2. Unescape the string (remove escape characters)
		const unescapedJson = JSON.parse(`"${escapedJson}"`);

		// 3. Parse the unescaped JSON string to actual object
		return JSON.parse(unescapedJson);
	} catch (error) {
		console.error("Error decoding base64 escaped JSON:", error);
		return null;
	}
}

export function parseUrlParams(): {
	before: Record<string, any> | null;
	after: Record<string, any> | null;
} {
	const params = new URLSearchParams(window.location.search);
	const beforeParam = params.get("before");
	const afterParam = params.get("after");

	const result = {
		before: null,
		after: null,
	};

	if (beforeParam) {
		result.before = decodeBase64Json(beforeParam);
	}

	if (afterParam) {
		result.after = decodeBase64Json(afterParam);
	}

	return result;
}
