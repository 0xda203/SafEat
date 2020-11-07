var table = $('#dataTable');
table = table.DataTable({
    responsive: true,
    language: {
        'paginate': {
            'previous': 'Anterior',
            'next': 'Próxima',
        },
        'processing': 'Processando...',
        'loadingRecords': 'Carregando...',
        'info': 'Mostrando página _PAGE_ de _PAGES_',
        'zeroRecords': 'Nenhum resultado encontrado',
        'lengthMenu': 'Mostrando _MENU_ registros por página',
        'infoEmpty': 'Nenhum registro disponível',
        'infoFiltered': '(filtrado de um total de _MAX_ registros)',
        'search': 'Buscar'
    },
});