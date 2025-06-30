import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePopUp from '@/components/editProfilePopUp,';
import { useAuth } from '@/context/authContext'; 

jest.mock('@/context/authContext', () => ({
  useAuth: jest.fn(),
}));

describe('ProfilePopUp', () => {
  const setShowModalMock = jest.fn();

  beforeEach(() => {
    setShowModalMock.mockClear();

    (useAuth as jest.Mock).mockReturnValue({
      profile: {
        about: 'Software Developer',
        availability: 'Full-Time',
        prevRoles: [{ title: 'Junior Developer', description: 'Worked on front-end' }],
        skills: ['JavaScript'],
        credentials: ['Bachelor\'s Degree'],
      },
      updateProfile: jest.fn(),
    });
  });

  test('displays error when required fields are empty', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      profile: {
        about: '',
        availability: '',
        prevRoles: [{ title: '', description: '' }],
        skills: [''],
        credentials: [''],
      },
      updateProfile: jest.fn(),
    });

    render(<ProfilePopUp setShowModal={setShowModalMock} />);

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText(/about section cannot be empty/i)).toBeInTheDocument();
      expect(screen.getByText(/availability must be selected/i)).toBeInTheDocument();
      expect(screen.getByText(/previous role 1: title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/skill 1 cannot be empty/i)).toBeInTheDocument();
      expect(screen.getByText(/credential 1 cannot be empty/i)).toBeInTheDocument();
    });
  });

  test('calls updateProfile and closes modal on successful form submission', async () => {
    const updateProfileMock = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      profile: {
        about: 'Software Developer',
        availability: 'Full-Time',
        prevRoles: [{ title: 'Junior Developer', description: 'Worked on front-end' }],
        skills: ['JavaScript'],
        credentials: ['Bachelor\'s Degree'],
      },
      updateProfile: updateProfileMock,
    });

    render(<ProfilePopUp setShowModal={setShowModalMock} />);

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(updateProfileMock).toHaveBeenCalledWith({
        about: 'Software Developer',
        availability: 'Full-Time',
        prevRoles: [{ title: 'Junior Developer', description: 'Worked on front-end' }],
        skills: ['JavaScript'],
        credentials: ['Bachelor\'s Degree'],
        id: undefined, 
        picture: undefined, 
      });
      expect(setShowModalMock).toHaveBeenCalledWith(false);
    });
  });

});
