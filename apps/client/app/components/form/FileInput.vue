<template>
  <UFormField
    :label="label"
    :name="name"
    size="lg"
    :hint="hint"
  >
    <!-- trailing -->
    <UInput
      class="w-full"
      type="file"
      :loading="loading"
      :disabled="disabled"
      accept="image/*"
      :avatar="{
        src: image,
        alt: label || 'Avatar',
        size: 'md'
      }"
      :ui="{
        leading: 'ps-1'
      }"
      @input="handleFileInput"
    />
    <!-- @change="handleFileInput" -->
  </UFormField>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: '',
    required: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  folder: {
    type: String,
    default: ''
  },
  isCloudinary: {
    type: Boolean,
    default: true
  },
  fullPath: {
    type: Boolean,
    default: false
  },
  hint: {
    type: String,
    default: ''
  }
})

const config = useRuntimeConfig()
const { cloudinary } = config.public
const image = ref('')
const loading = ref(false)

if (props.isCloudinary) {
  image.value = props.modelValue?.startsWith('http') ? props.modelValue : `${cloudinary.cloudinaryUrl}${props.modelValue}`
} else {
  image.value = props.modelValue
}

const handleFileInput = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (props.isCloudinary) {
    await uploadToCloudinary(file)
  } else {
    handleLocalFile(file)
  }
}

const uploadToCloudinary = async (file) => {
  loading.value = true

  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', props.folder)
  formData.append('fullPath', String(props.fullPath))

  try {
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    image.value = response.url
    if (props.fullPath) {
      emit('update:modelValue', response.url)
    } else {
      emit('update:modelValue', response.path)
    }
  } catch {
    const toast = useToast()
    toast.add({ title: 'فشل رفع الصورة', color: 'error', timeout: 4000 })
  } finally {
    loading.value = false
  }
}

const handleLocalFile = (file) => {
  if (image.value && image.value.startsWith('blob:')) {
    URL.revokeObjectURL(image.value)
  }
  image.value = file ? URL.createObjectURL(file) : ''
  emit('update:modelValue', file)
}

onBeforeUnmount(() => {
  if (image.value && image.value.startsWith('blob:')) {
    URL.revokeObjectURL(image.value)
  }
})
</script>
