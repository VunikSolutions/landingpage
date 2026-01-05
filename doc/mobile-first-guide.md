# Guia Mobile First - Vunik

## Princípios Mobile First

O projeto Vunik segue a abordagem **Mobile First**, onde:

1. **Estilos base são para mobile** (telas pequenas)
2. **Media queries adicionam estilos para desktop** (telas maiores)
3. **Progressive enhancement**: começamos simples e adicionamos complexidade

## Estrutura de Código

### ✅ CORRETO (Mobile First)

```scss
.elemento {
  // Estilos MOBILE (padrão)
  padding: var(--spacing-lg) 16px;
  font-size: 16px;
  display: flex;
  flex-direction: column;

  // Estilos DESKTOP (adicionais)
  @include desktop {
    padding: var(--spacing-xl) 24px;
    font-size: 18px;
    flex-direction: row;
  }
}
```

### ❌ INCORRETO (Desktop First)

```scss
.elemento {
  // Estilos DESKTOP (padrão) - ERRADO!
  padding: var(--spacing-xl) 24px;
  font-size: 18px;
  flex-direction: row;

  // Estilos MOBILE (sobrescrevendo) - ERRADO!
  @include mobile {
    padding: var(--spacing-lg) 16px;
    font-size: 16px;
    flex-direction: column;
  }
}
```

## Padrões por Tipo de Propriedade

### Espaçamento (Padding/Margin)
```scss
.elemento {
  padding: var(--spacing-md) 16px; // Mobile
  
  @include desktop {
    padding: var(--spacing-xl) 24px; // Desktop
  }
}
```

### Tipografia
```scss
.titulo {
  font-size: 24px; // Mobile
  
  @include desktop {
    font-size: 48px; // Desktop
  }
}
```

### Layout (Grid/Flex)
```scss
.grid {
  display: grid;
  grid-template-columns: 1fr; // Mobile: 1 coluna
  gap: var(--spacing-md);
  
  @include desktop {
    grid-template-columns: repeat(2, 1fr); // Desktop: 2 colunas
    gap: var(--spacing-xl);
  }
}
```

### Visibilidade
```scss
.elemento-desktop {
  display: none; // Mobile: oculto
  
  @include desktop {
    display: block; // Desktop: visível
  }
}

.elemento-mobile {
  display: block; // Mobile: visível
  
  @include desktop {
    display: none; // Desktop: oculto
  }
}
```

## Breakpoints

- **Mobile**: até 1023px (padrão)
- **Desktop**: 1024px em diante

## Benefícios

1. **Performance**: Menos CSS para carregar em mobile
2. **Manutenibilidade**: Mais fácil de entender e manter
3. **Progressive Enhancement**: Funciona bem em todos os dispositivos
4. **Melhor UX**: Foco no que é essencial primeiro

