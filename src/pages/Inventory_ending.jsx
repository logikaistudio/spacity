<div className="flex gap-md justify-end">
    <Button type="button" variant="secondary" onClick={resetForm}>
        Batal
    </Button>
    <Button type="submit" variant="success">
        {editingItem ? 'Simpan Perubahan' : 'Tambah Item'}
    </Button>
</div>
                    </div >
                </form >
            </Modal >

    {/* Export Modal */ }
    < ExportModal
isOpen = { showExportModal }
onClose = {() => setShowExportModal(false)}
onExport = { handleExport }
type = "inventory"
    />
        </div >
    );
}
