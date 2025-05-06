export const getUserProfile = (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: userId,
            name: 'Kancharla Intel',
            email: 'tejaintel07@gmail.com',
            role: 'user',
          },
        });
      }, 1000);
    });
  };
  