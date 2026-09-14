import type { CollegeData, TimetableResult } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function generateSchedule(data: CollegeData): Promise<TimetableResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Attempt to parse JSON error details if present
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { detail: response.statusText };
      }

      if (response.status === 422) {
        throw new APIError(422, 'Validation Error', errorData);
      } else if (response.status >= 500) {
        throw new APIError(response.status, 'Internal Server Error', errorData);
      } else {
        throw new APIError(response.status, errorData.detail || 'An unexpected error occurred', errorData);
      }
    }

    return await response.json() as TimetableResult;
  } catch (error) {
    // If it's already an APIError, rethrow it
    if (error instanceof APIError) {
      throw error;
    }
    
    // Fallback for network errors (fetch failed entirely, e.g. server down or CORS failed)
    throw new APIError(0, 'Network or server unavailable', error);
  }
}
