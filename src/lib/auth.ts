import AsyncStorage from "@react-native-async-storage/async-storage";

export type MockAuthUser = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type MockAuthSession = {
  isAuthenticated: boolean;
  user: MockAuthUser | null;
};

const MOCK_AUTH_STORAGE_KEY = "@jod/mock-auth";

const defaultSession: MockAuthSession = {
  isAuthenticated: false,
  user: null,
};

export async function getMockAuth(): Promise<MockAuthSession> {
  const storedValue = await AsyncStorage.getItem(MOCK_AUTH_STORAGE_KEY);

  if (!storedValue) {
    return defaultSession;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as MockAuthSession;

    if (!parsedValue?.isAuthenticated) {
      return defaultSession;
    }

    return {
      isAuthenticated: true,
      user: parsedValue.user ?? null,
    };
  } catch {
    await AsyncStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
    return defaultSession;
  }
}

export async function setMockAuth(user: MockAuthUser): Promise<void> {
  const session: MockAuthSession = {
    isAuthenticated: true,
    user,
  };

  await AsyncStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(session));
}

export async function clearMockAuth(): Promise<void> {
  await AsyncStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
}
