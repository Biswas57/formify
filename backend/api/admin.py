from django.contrib import admin
from .models import FormComposition, Form, InfoBlock, IdShort, AddressInfo, Notes, Address

# Register FormComposition with custom display
@admin.register(FormComposition)
class FormCompositionAdmin(admin.ModelAdmin):
    list_display = ('form_composition_id', 'name', 'owner', 'has_id_short', 'has_address_info', 'has_notes')
    list_filter = ('has_id_short', 'has_address_info', 'has_notes')
    search_fields = ('name', 'owner__username')

# Register Form with custom display
@admin.register(Form)
class FormAdmin(admin.ModelAdmin):
    list_display = ('id', 'form_composition', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('form_composition__name',)

# Register InfoBlock with custom display
@admin.register(InfoBlock)
class InfoBlockAdmin(admin.ModelAdmin):
    list_display = ('info_id', 'form', 'info_type', 'order_id')
    list_filter = ('info_type',)
    search_fields = ('form__form_composition__name',)

# Register IdShort with custom display
@admin.register(IdShort)
class IdShortAdmin(admin.ModelAdmin):
    list_display = ('info', 'name', 'number', 'email', 'type')
    search_fields = ('name', 'email')

# Register AddressInfo with custom display
@admin.register(AddressInfo)
class AddressInfoAdmin(admin.ModelAdmin):
    list_display = ('info', 'type')
    search_fields = ('type',)

# Register Address with custom display
@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('address_id', 'address_info', 'text', 'date_moved_in', 'date_moved_out')
    search_fields = ('text',)
    list_filter = ('date_moved_in', 'date_moved_out')

# Register Notes with custom display
@admin.register(Notes)
class NotesAdmin(admin.ModelAdmin):
    list_display = ('info', 'content')
    search_fields = ('content',)