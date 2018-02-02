(function(){
angular.module('primeiraApp').controller('BillingCycleCtrl',[
    '$http',
    '$location',
    'msgs',
    'tabs',
    'consts',
    BillingCycleController
])
function BillingCycleController($http,$location,msgs,tabs,consts){
    const vm = this
    const url = `${consts.apiUrl}/billingCycles?skip=${(page - 1) * 10}&limit=10`

    vm.refresh = ()=>{
        const page = parseInt($location.search().page) || 1
        $http.get(url).then(function(response){
            vm.billingCycle = {credits:[{}],debits:[{}]}
            vm.billingCycles = response.data
            vm.calculateValues()
           

            $http.get(`${consts.apiUrl}/billingCycles/count`).then(function(response){
                vm.pages = Math.ceil(response.data.value / 10)
                tabs.show(vm,{tabList:true, tabCreate:true})
            })
            
        })
    }

    vm.create = function(){
        $http.post(`${consts.apiUrl}/billingCycles`,vm.billingCycle).then(function(response){
            vm.refresh();
            msgs.addSuccess('Operação realizada com sucesso!')
        }).catch(function(resp){
            console.log(resp.data)
            msgs.addError(resp.data.errors)
        })
    }

    vm.showTabUpdate = function(billingCycle){
        vm.billingCycle = billingCycle
        vm.calculateValues()
        tabs.show(vm,{tabUpdate:true})
    }
    vm.showTabDelete = function(billingCycle){
        vm.billingCycle = billingCycle
        vm.calculateValues()
        tabs.show(vm,{tabDelete:true})
    }

    vm.update = function(){
        const updateUrl = `${consts.apiUrl}/billingCycles/${vm.billingCycle._id}`
        $http.put(updateUrl,vm.billingCycle).then(function(response){
            vm.refresh();
            msgs.addSuccess("Operação realizada com sucesso!")
        }).catch(function(response){
            msgs.addError(response.errors)
        })
    }
    vm.delete = function(){
        const deleteUrl = `${consts.apiUrl}/billingCycles/${vm.billingCycle._id}`
        $http.delete(deleteUrl).then(function(response){
            vm.refresh();
            msgs.addSuccess('Operação realizada com sucesso!')
        }).catch(function(response){
            msgs.addError(response.errors)
        })
    }

    vm.addCredit = function(index)
    {
        vm.billingCycle.credits.splice(index +1,0,{})
    }
    vm.cloneCredit = function(index, {name, value})
    {
        vm.billingCycle.credits.splice(index + 1, 0, {name,value})
        vm.calculateValues()
    }
    vm.deleteCredit = function(index)
    {
        if(vm.billingCycle.credits.length > 1)
        {
            vm.billingCycle.credits.splice(index,1)
            vm.calculateValues()
        }
    }


    vm.addDebit = function(index)
    {
        vm.billingCycle.debits.splice(index +1,0,{})
    }
    vm.cloneDebit = function(index, {name, value,status})
    {
        vm.billingCycle.debits.splice(index + 1, 0, {name,value,status})
        vm.calculateValues()
    }
    vm.deleteDebit = function(index)
    {
        if(vm.billingCycle.debits.length > 1)
        {
            vm.billingCycle.debits.splice(index,1)
            vm.calculateValues()
        }
    }


    vm.calculateValues = function()
    {
        vm.credit=0
        vm.debit = 0
        
        if(vm.billingCycle)
        {
            vm.billingCycle.credits.forEach(function({value}){
                vm.credit += !value || isNaN(value) ? 0 : parseFloat(value)
            })

            vm.billingCycle.debits.forEach(function({value}){
                vm.debit += !value || isNaN(value) ? 0 : parseFloat(value)
            })
        }

        vm.total = vm.credit - vm.debit
    }

    vm.refresh()
}

})()