//@ts-nocheck
var linesNumber = 0

describe('Tesi', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200/charts')
  })

  it('canvas su restringi', () => {


    cy.get('[id=restringi]').click();
    cy.wait(1000)
    cy.get('[id=areaChart1]').invoke('height').then(parseInt).should('be.gt', 100)
    cy.get('[id=areaChart]').invoke('height').then(parseInt).should('be.gt', 100)

  })

  it('svg esiste ', () => {

    cy.get('svg').should('not.exist'); // non c'è nessun svg nell'attuale dom
    //cy.get('[id=svg]').children()[1].should('contain', 'Data')

    cy.get('[id=restringi]').click();
    cy.wait(1000)

    cy.get('[id=input-soglia-x-ristrette]').clear().type('0.05');
    cy.wait(1000)

    cy.get('[id=aggiungi-soglia-ristrette-button]').click();
    cy.wait(1000)

    cy.get('[id=filtra-per-soglia-ristrette-button]').click();
    cy.wait(1000)

    cy.get('[id=variabileXristrette]').clear().type('diff_S904E');
    cy.wait(1000)


    let radios = []
    for (let i = 1; i < 13; i++) {
      let num = Math.floor(Math.random() * (12 - 1 + 1) + 1)
      cy.get('[id=radio' + String(num) + ']').check()
      cy.log(num)
      radios.push(num)
    }


    cy.get('[id=generaSVGjava]').click();


    cy.wait(60000)
    cy.get('rect').should('exist'); // per vedere che è stato generato il file SVG con rect dentro e non l'altro svg con circle( quello dell'attesa)


    cy.get('[id=analizzaRistretteTraVariabili]').click();
    cy.wait(4000)

    if (radios.includes(1) && radios.includes(2) && radios.includes(3) && radios.includes(8)) {
      cy.get('body').should('contain', 'distanza nodi = 3')
      cy.wait(1000)
    }


    // linesNumber = cy.invoke('line').its('length')
    //   .then((count) => {
    //     linesNumber = +count
    //   })


  })
  it('svg 2 esiste ', () => {

    cy.visit('http://localhost:4200/svg-output?rotti=')
    cy.get('circle').should('not.exist');
    cy.get('[id=visualizza-svg-d3-button]').click();
    cy.wait(3000)
    cy.get('circle').should('exist');

/*

    cy.log('Rectnumber=' + linesNumber)
    cy.log('circleNUmber=' + cy.get('circle').its('length'))


    cy.get('path').its('length').should('eq', linesNumber)
*/


  })

})
