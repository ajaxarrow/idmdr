import { createGlobalState } from "@vueuse/core";
import { computed, reactive, ref } from "vue";
import { server } from "../../../plugins/axios.ts";
import { useSnackbarStore } from "../../../core/stores/snackbar.store.ts";
import { Status } from "../../../interfaces/enums/status.enum.ts";

const { showSnackbarMessage } = useSnackbarStore()

// Initial states for clean reset
const initialCredentials = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
}

const initialErrorMessages = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
}

// Reactive state
const userCredentials = reactive({...initialCredentials})
const errorMessages = reactive({...initialErrorMessages})
const passwordStrength = ref(0)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Computed properties
const passwordStrengthText = computed(() => {
    if (passwordStrength.value === 0) return ''
    if (passwordStrength.value < 2) return 'Weak'
    if (passwordStrength.value < 4) return 'Medium'
    return 'Strong'
})

const passwordStrengthColor = computed(() => {
    if (passwordStrength.value === 0) return ''
    if (passwordStrength.value < 2) return 'error'
    if (passwordStrength.value < 4) return 'warning'
    return 'success'
})

const isFormValid = (isLoginMode: boolean) => {
    if (isLoginMode) {
        return validateEmail(userCredentials.email) &&
            userCredentials.password.length >= 8
    } else {
        return validateEmail(userCredentials.email) &&
            userCredentials.password.length >= 8 &&
            userCredentials.password === userCredentials.confirmPassword &&
            userCredentials.firstName.length > 0 &&
            userCredentials.lastName.length > 0
    }
}

// Validation functions
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return email.length > 0 && email.length <= 254 && emailRegex.test(email)
}

const handleEmailInput = (): void => {
    if (!validateEmail(userCredentials.email) && userCredentials.email.length > 0) {
        errorMessages.email = 'Please enter a valid email address'
    } else if (userCredentials.email.length > 254) {
        errorMessages.email = 'Email must be 254 characters or less'
    } else {
        errorMessages.email = ''
    }
}

const validatePassword = (password: string): void => {
    errorMessages.password = ''

    if (password.length === 0) {
        passwordStrength.value = 0
        return
    }

    if (password.length < 8) {
        errorMessages.password = 'Password must be at least 8 characters'
        passwordStrength.value = 1
        return
    }

    // Calculate password strength
    let strength = 0

    // Length check
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++

    // Character variety checks
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    passwordStrength.value = strength
}

const handlePasswordInput = (): void => {
    validatePassword(userCredentials.password)
    if (userCredentials.confirmPassword) {
        validateConfirmPassword()
    }
}

const validateConfirmPassword = (): void => {
    if (userCredentials.confirmPassword.length === 0) {
        errorMessages.confirmPassword = ''
    } else if (userCredentials.password !== userCredentials.confirmPassword) {
        errorMessages.confirmPassword = 'Passwords do not match'
    } else {
        errorMessages.confirmPassword = ''
    }
}

const handleNameInput = (field: 'firstName' | 'lastName'): void => {
    if (userCredentials[field].length > 150) {
        errorMessages[field] = `${field === 'firstName' ? 'First' : 'Last'} name must be 150 characters or less`
        userCredentials[field] = userCredentials[field].substring(0, 150)
    } else {
        errorMessages[field] = ''
    }
}

const clearUserCredentials = () => {
    // Set to initial values for clean slate
    Object.assign(userCredentials, {...initialCredentials})
    Object.assign(errorMessages, {...initialErrorMessages})
    passwordStrength.value = 0
}

const handleRegister = async () => {
    try {
        await server.post('/api/auth/register/', {
            email: userCredentials.email,
            password: userCredentials.password,
            first_name: userCredentials.firstName,
            last_name: userCredentials.lastName
        })
        window.location.href = '/auth/email?tab=login'
        showSnackbarMessage('Successfully registered', Status.success)
        clearUserCredentials()
    } catch (e: any) {
        if (e.response && e.response.data) {
            const errors = e.response.data;
            if (errors.email) errorMessages.email = errors.email[0];
            if (errors.password) errorMessages.password = errors.password[0];
            if (errors.first_name) errorMessages.firstName = errors.first_name[0];
            if (errors.last_name) errorMessages.lastName = errors.last_name[0];

            showSnackbarMessage('Registration failed. Please check the form for errors.', Status.error)
        } else {
            showSnackbarMessage('Registration failed. Please try again later.', Status.error)
        }
        console.log(e)
    }
}

const handleLogin = async () => {
    try {
        const res = await server.post('/api/auth/token/', {
            email: userCredentials.email,
            password: userCredentials.password
        })
        if(res.data.user.is_active){
            const user = {
                user: res.data.user,
                accessToken: res.data.access,
                refreshToken: res.data.refresh
            }
            await localStorage.setItem('user', JSON.stringify(user))
            window.location.href = '/dashboard'
            showSnackbarMessage('Successfully logged in', Status.success)
            clearUserCredentials()
        } else {
            await localStorage.setItem('inactivityWarning', JSON.stringify({
                message: 'Account is Disabled',
            }))
            window.location.href = '/auth'
        }
    } catch (e: any) {
        if (e.response && e.response.data && e.response.data.detail) {
            showSnackbarMessage(e.response.data.detail ?? 'Login failed. Please try again later.', Status.error)
        }
        else if (e.response && e.response.status === 401) {
            showSnackbarMessage('Invalid email or password', Status.error)
        } else {
            showSnackbarMessage('Login failed. Please try again later.', Status.error)
        }
        console.log(e)
    }
}

export const useEmailAuthStore = createGlobalState(() => ({
    handleLogin,
    handleRegister,
    userCredentials,
    errorMessages,
    clearUserCredentials,
    validateEmail,
    handleEmailInput,
    validatePassword,
    handlePasswordInput,
    validateConfirmPassword,
    handleNameInput,
    isFormValid,
    passwordStrength,
    passwordStrengthText,
    passwordStrengthColor,
    showPassword,
    showConfirmPassword
}))