from django.db import models
from django.contrib.auth.models import User


class FormComposition(models.Model):
    """
    A template for forms created by a user that can be used multiple times
    """
    form_composition_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='form_compositions')
    name = models.CharField(max_length=255)
    has_id_short = models.BooleanField(default=False)
    has_address_info = models.BooleanField(default=False)
    has_notes = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} (Composition #{self.form_composition_id})"


class Form(models.Model):
    """
    An actual form instance based on a form composition
    """
    id = models.AutoField(primary_key=True)
    form_composition = models.ForeignKey(FormComposition, on_delete=models.CASCADE, related_name='forms')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Form #{self.id} - {self.form_composition.name}"


class InfoBlock(models.Model):
    """
    Base model for different types of information blocks
    """
    INFO_TYPE_CHOICES = [
        ('id_short', 'ID Short'),
        ('address_info', 'Address Info'),
        ('notes', 'Notes')
    ]
    
    info_id = models.AutoField(primary_key=True)
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name='info_blocks')
    info_type = models.CharField(max_length=20, choices=INFO_TYPE_CHOICES)
    order_id = models.IntegerField(help_text="Order of this block within the form")
    
    class Meta:
        ordering = ['order_id']
    
    def __str__(self):
        return f"{self.get_info_type_display()} Block #{self.info_id}"


class IdShort(models.Model):
    """
    A short identification information block
    """
    info = models.OneToOneField(InfoBlock, on_delete=models.CASCADE, primary_key=True, related_name='id_short')
    name = models.CharField(max_length=255, null=True, blank=True)
    number = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    type = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return f"ID Short: {self.name or 'Unnamed'}"

    def save(self, *args, **kwargs):
        # Ensure that the related InfoBlock has the correct type
        if self.info_id and not hasattr(self, 'info'):
            self.info = InfoBlock.objects.get(info_id=self.info_id)
        self.info.info_type = 'id_short'
        self.info.save()
        super().save(*args, **kwargs)


class AddressInfo(models.Model):
    """
    An address information block
    """
    info = models.OneToOneField(InfoBlock, on_delete=models.CASCADE, primary_key=True, related_name='address_info')
    type = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return f"Address Info #{self.info_id}"

    def save(self, *args, **kwargs):
        # Ensure that the related InfoBlock has the correct type
        if self.info_id and not hasattr(self, 'info'):
            self.info = InfoBlock.objects.get(info_id=self.info_id)
        self.info.info_type = 'address_info'
        self.info.save()
        super().save(*args, **kwargs)


class Address(models.Model):
    """
    A specific address entry related to an AddressInfo block
    """
    address_id = models.AutoField(primary_key=True)
    address_info = models.ForeignKey(AddressInfo, on_delete=models.CASCADE, related_name='addresses')
    text = models.TextField(unique=True)
    date_moved_in = models.DateField(null=True, blank=True)
    date_moved_out = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"Address: {self.text[:30]}{'...' if len(self.text) > 30 else ''}"


class Notes(models.Model):
    """
    A notes information block
    """
    info = models.OneToOneField(InfoBlock, on_delete=models.CASCADE, primary_key=True, related_name='notes')
    content = models.TextField(max_length=1000, help_text="Maximum 1000 characters for notes")
    
    def __str__(self):
        return f"Notes #{self.info_id}"

    def save(self, *args, **kwargs):
        # Ensure that the related InfoBlock has the correct type
        if self.info_id and not hasattr(self, 'info'):
            self.info = InfoBlock.objects.get(info_id=self.info_id)
        self.info.info_type = 'notes'
        self.info.save()
        super().save(*args, **kwargs)