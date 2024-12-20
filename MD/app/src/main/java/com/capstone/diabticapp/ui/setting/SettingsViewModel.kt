package com.capstone.diabticapp.ui.setting

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.viewModelScope
import com.capstone.diabticapp.data.AuthRepository
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch

class SettingsViewModel (private val authRepository: AuthRepository) : ViewModel() {

    // Observe username from UserPreference
    val username: LiveData<String> = authRepository.getUserSession().map { session ->
        session.name ?: "No Name"
    }.asLiveData()

    // Observe profile picture URL from UserPreference
    val userPhotoUrl: LiveData<String?> = authRepository.getUserSession().map { session ->
        session.photoUrl
    }.asLiveData()

    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
        }
    }
}